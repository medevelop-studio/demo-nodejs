import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { User } from '../common/entity/user.entity';
import { UserDto } from '../common/dto/user.dto';
import {
  UserDictionary,
  UserEnum,
} from '../common/dictionary/user';
import { PermissionDictionary, PermissionEnum } from '../common/dictionary/permission';
import { RequestBanUserDto } from './dto/request-ban.dto';
import { Finder } from '../common/base/finder';
import { Env } from '../common/dictionary/env';
import { DefaultResponseDto } from '../common/dto/default.response.dto';
import { RequestFindOneByIdDto } from './dto/request-find-one-by-id.dto';
import { RequestCreateDto } from './dto/request-create.dto';
import { RequestUpdateUserDto } from './dto/request-update.dto';
import { RequestGetUserDto } from './dto/request-find-all.dto';
import { BackConnectDto } from '../common/dto/back-connect.dto';
import { RequestGetBackConnectDto } from '../common/dto/request-get-back-connect.dto';
import {
  RequestHelper,
  RequestHelperDto,
} from '../common/helpers/request-helper';
import { FindAllResponseDto } from './dto/find-all-response.dto';
import { RequestGetLogDto } from './dto/request-log.dto';
import { RequestEditUserDto } from './dto/request-edit.dto';
import { DisplaySettings } from '../common/entity/display-settings.entity';
import { RequestFindOneByUidDto } from './dto/request-find-one-by-uid.dto';
import { RequestWriteLogDto } from './dto/request-write-log.dto';
import { UserLogTypeEnum } from '../common/dictionary/user-log';
import { ObjectHelper } from '../common/helpers/object-helper';
import { AuthInfo } from './dto/auth-info.dto';
import { UserLog } from '../common/entity/user-log.entity';
import { AppModule } from '../app.module';
import { UserLogDto } from './dto/user-account-log.dto';
import { generateRandomString } from '../common/helpers/random-helper';
import { RequestInvalidateSessionDto } from '../common/dto/request-invalidate-session';
import { InvalidateSessionEnum } from '../common/dictionary/invalidate-session';

@Injectable()
export class UserService {
  private finder: Finder<User>;
  private requestHelper: RequestHelper;
  private step: number = 1000;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserLog)
    private readonly userLogRepository: Repository<UserLog>,
    @InjectRepository(DisplaySettings)
    private readonly displaySettingsRepository: Repository<DisplaySettings>,
  ) {
    try {
      this.requestHelper = new RequestHelper();
    } catch (e) {
      throw new HttpException('Cannot Auhorize Service', HttpStatus.FORBIDDEN);
    }
    this.finder = new Finder(userRepository);
  }

  public async cleanExpiredTokens(): Promise<void> {
    const totalCount: number = await this.getUsersTotalCount();
    const updatingPromises: Promise<User[]>[] = [];

    for (let i: number = 0; i < totalCount; i += this.step) {
      updatingPromises.push(this.updateUsersToken(i, this.step));
    }

    await Promise.all(updatingPromises);
  }

  public async deleteOldUserLogsFromDb(): Promise<void> {
    const DELTA = 259200000; // 3 days in milliseconds
    const allowedDate: Date = new Date(Date.now() - DELTA);

    await this.userLogRepository
      .createQueryBuilder('userLog')
      .delete()
      .where('"createdAt" < :allowedDate', { allowedDate })
      .execute();
  }

  public async findOneById(
    requestFindOneByIdDto: RequestFindOneByIdDto,
  ): Promise<UserDto> {
    return new UserDto(
      await this.findOneByIdQuery(requestFindOneByIdDto.userId),
    );
  }

  public async findActiveUser(id: number): Promise<User> {
    const user: User = await this.findOneByIdQuery(id);

    if (user.status !== UserDictionary.USER_STATUS_ACTIVE) {
      throw new HttpException(
        'Requested user is not active.',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  public async findOneByUid(data: RequestFindOneByUidDto): Promise<UserDto> {
    const user: User = await this.finder.findOneByParam('subId', data.userUid);

    if (!user) {
      throw new HttpException('User is not found.', HttpStatus.NOT_FOUND);
    }

    if (user.status !== UserDictionary.USER_STATUS_ACTIVE) {
      throw new HttpException(
        'Requested user is not active.',
        HttpStatus.NOT_FOUND,
      );
    }

    return new UserDto(user);
  }

  public async findAll(params: RequestGetUserDto): Promise<FindAllResponseDto> {
    const search: string = params.params ? params.params.toLowerCase() : '';
    const [users, count]: [User[], number] = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.displaySettings', 'displaySettings')
      .where('user.status != :status', { status: UserEnum.USER_STATUS_DELETED })
      .andWhere(search ? 'LOWER(user.login) LIKE :login' : 'true', {
        login: `%${search}%`,
      })
      .orWhere(search ? 'LOWER(user.comment) LIKE :param' : 'true', {
        param: `%${search}%`,
      })
      .orderBy('user.id', 'ASC')
      .skip(params.amountPerPage * (params.pageNumber - 1))
      .take(params.amountPerPage)
      .getManyAndCount();

    const mappedUsers: UserDto[] = users.map(user => new UserDto(user));

    return new FindAllResponseDto(
      mappedUsers,
      count,
      params.pageNumber,
      params.amountPerPage,
    );
  }

  public async create(data: RequestCreateDto): Promise<UserDto> {
    if ((await this.userRepository.find({ login: data.login })).length > 0) {
      throw new HttpException(
        'User with this login is already exists.',
        HttpStatus.CONFLICT,
      );
    }

    if (data.bcServerId) {
      const requestGetBackConnectDto: RequestGetBackConnectDto = {
        bcServerId: data.bcServerId,
      };

      await this.requestHelper.request<
        RequestGetBackConnectDto,
        BackConnectDto
      >(
        new RequestHelperDto(
          'http',
          Env.SERVICE_ACTIVATION,
          'backConnect/getBackConnect',
          'get',
          requestGetBackConnectDto,
        ),
      );
    }

    const user: User = new User(
      data.permissionLevel,
      data.login,
      this.hashPassword(data.password),
      new DisplaySettings(),
      '',
      UserEnum.USER_STATUS_ACTIVE,
      data.expirationDate,
    );

    return new UserDto(await this.userRepository.save(user));
  }

  public async ban(
    requestBanUserDto: RequestBanUserDto,
  ): Promise<DefaultResponseDto> {
    const user: User = await this.findOneByIdQuery(requestBanUserDto.userId);

    if (!user) {
      throw new HttpException(
        'Requested user is not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      user.permissionLevel === PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL
    ) {
      throw new HttpException(
        'Requested user cannot be banned.',
        HttpStatus.CONFLICT,
      );
    }

    if (user.status === requestBanUserDto.userStatus) {
      throw new HttpException(
        `This user is already ${
          requestBanUserDto.userStatus === UserDictionary.USER_STATUS_ACTIVE
            ? 'active'
            : 'banned'
        }.`,
        HttpStatus.CONFLICT,
      );
    }

    await this.userRepository.save({
      ...user,
      status: requestBanUserDto.userStatus,
    });

    return new DefaultResponseDto(
      0,
      `User successfully ${
        requestBanUserDto.userStatus === UserDictionary.USER_STATUS_ACTIVE
          ? 'un'
          : ''
      }banned.`,
    );
  }

  public async delete(userId: number): Promise<DefaultResponseDto> {
    const user: User = await this.findOneByIdQuery(userId);

    if (!user) {
      throw new HttpException(
        'Requested user is not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      user.permissionLevel === PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL ||
      user.permissionLevel === PermissionDictionary.USER_DEMO_PERMISSION_LEVEL
    ) {
      throw new HttpException(
        'Requested user cannot be deleted.',
        HttpStatus.CONFLICT,
      );
    }

    if (user.status === UserEnum.USER_STATUS_DELETED) {
      throw new HttpException(
        'This user is already deleted',
        HttpStatus.CONFLICT,
      );
    }

    await this.userRepository.save({
      ...user,
      status: UserEnum.USER_STATUS_DELETED,
    });

    return new DefaultResponseDto(
      0,
      'User successfully deleted',
    );
  }

  public async update(data: RequestUpdateUserDto): Promise<UserDto> {
    let user: User = await this.findActiveUser(data.userId);

    if (((data.login && user.login !== data.login) || data.password) && user.permissionLevel < PermissionEnum.USER_ADMIN_PERMISSION_LEVEL) {
      user.authInfo = null;

      await this.requestHelper.request<
          RequestInvalidateSessionDto,
          void
        >(
          new RequestHelperDto(
            'http',
            Env.SERVICE_ACTIVATION,
            'socket/invalidateSession',
            'post',
            {
              userUUID: user.login,
              type: InvalidateSessionEnum.CREDENTIALS_CHANGED,
            },
          ),
        );
    }

    user = ObjectHelper.reassign<User, RequestUpdateUserDto>(user, data, ['password']);

    if (data.password) {
      user.isFromOldSystem = false;
      user.password = this.hashPassword(data.password);
    }

    return new UserDto(await this.userRepository.save(user));
  }

  public async edit(data: RequestEditUserDto): Promise<UserDto> {
    const user: User = await this.findActiveUser(data.userId);

    if (data.password) {
      user.isFromOldSystem = false;
      user.password = this.hashPassword(data.password);
    }

    return new UserDto(await this.userRepository.save(user));
  }

  public async createUsersForTests(limit: number): Promise<{newUserLogins: string[], displaySettingIds: number[]}> {
    const users: User[] = [];
    const newUserLogins: string[] = [];

    for (let i: number = 0; i < limit; i++) {
      const randomLoginAndPassword: string = generateRandomString(32);

      users.push({
        ...new User(
          PermissionDictionary.USER_CLIENT_PERMISSION_LEVEL,
          randomLoginAndPassword,
          this.hashPassword(randomLoginAndPassword),
          new DisplaySettings(),
        ),
      });

      newUserLogins.push(randomLoginAndPassword);
    }

    const createdUsers = await this.userRepository.save(users);
    const displaySettingIds = createdUsers.map((user) => user.displaySettings.id);

    return { newUserLogins, displaySettingIds };
  }

  public async getLogs(data: RequestGetLogDto): Promise<unknown> {
    try {
      const scrollTimeLimit: string = '30m';
      let scrollId: string = '';
      let logs = [];
      let totalAmount: number = 0;

      if (data.scrollId) {
        const scrollOption = {
          scrollId: data.scrollId,
          scroll: scrollTimeLimit,
        };

        const { body } = await AppModule.elasticClient.scroll(scrollOption);


        logs = [...body.hits.hits];
        totalAmount = body.hits.total.value;
        scrollId = body._scroll_id;
      } else {
        const from = data.amountPerPage * (data.pageNumber - 1);

        const searchOptions = {
          from,
          type: '_doc',
          size: data.amountPerPage,
          body: {
            sort: [{ 'timestamp': { 'order': 'desc' } }],
          },
        };

        if (data.userId) {
          searchOptions.body['query'] = {
            'bool': {
              'should': [
                {
                  'match_phrase': {
                    'requestData.userId': data.userId,
                  },
                },
                {
                  'match_phrase': {
                    'userId': data.userId,
                  },
                },
              ],
            },
          };
        }

        searchOptions['index'] = data.isUserAccountLog ?
          'log-user-account-info' :
          `log-user-service-info_${(new Date(data.date)).toISOString().split('T')[0]}`;

        const { body } = await AppModule.elasticClient.search(searchOptions);

        logs = [...body.hits.hits];
        totalAmount = body.hits.total.value;
        scrollId = body._scroll_id;
      }

      return { logs, totalAmount, scrollId };
    } catch (err) {
      // eslint-disable-next-line camelcase
      if (err?.meta?.body?.error?.caused_by?.type === 'search_context_missing_exception') {
        throw new HttpException(
          'Token is expired.',
          HttpStatus.GONE,
        );
      }

      if (err.message === 'index_not_found_exception') {
        return {};
      }

      throw new HttpException(
        err.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async writeToLog(data: RequestWriteLogDto): Promise<void> {
    let dataString: string = '';


    switch (data.actionType) {
      case UserLogTypeEnum.LOG_SUCCESSFUL_AUTHORIZATION:
        {
          dataString = `[${data.username}][${data.userIp}] - Successful authorization`;
        }
        break;
      case UserLogTypeEnum.LOG_AUTHORIZATION_FAIL_ACCOUNT_EXPIRED:
        {
          dataString = `[${data.username}][${data.userIp}] - Authorization fail (account expired)`;
        }
        break;
      case UserLogTypeEnum.LOG_AUTHORIZATION_FAIL_NEW_SESSION:
        {
          dataString = `[${data.username}][${data.userIp}] - Authorization fail (new session)`;
        }
        break;
      case UserLogTypeEnum.LOG_AUTHORIZATION_FAIL_INCORRECT_PASSWORD:
        {
          dataString = `[${data.username}][${data.userIp}] - Authorization fail (incorrect password [${data.wrongPassword}])`;
        }
        break;
    }

    const log: UserLogDto = new UserLogDto(
      data.userId,
      data.actionType,
      dataString,
      new Date().toISOString(),
    );

    AppModule.elasticClient.index({
      index: 'log-user-account-info',
      body: { ...log },
    }).catch((err) => {
      console.log(err);
      console.log('========= ELASTICSEARCH =========');
    });
  }

  private hashPassword(val: string): string {
    return crypto
      .createHmac('sha512', Env.PASS_SALT)
      .update(val)
      .digest('base64');
  }

  private async findOneByIdQuery(id: number): Promise<User> {
    const user: User = await this.finder.findOneByParam('id', id);

    if (!user) {
      throw new HttpException(
        'Requested user is not found.',
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  private async getUsersTotalCount(): Promise<number> {
    return await this.userRepository.count();
  }

  private async updateUsersToken(skip: number, take: number): Promise<User[]> {
    const users: User[] = await this.getUsers(skip, take);

    const updateUsers: User[] = users.map(user => {
      if (!user.authInfo) {
        return user;
      }

      const newAuthInfo: string = JSON.stringify(JSON.parse(user.authInfo as unknown as string)
        .map((authInfo: AuthInfo) => {
          return {
            ...authInfo,
            token: authInfo.token.filter((token: string) => this.validateToken(token)),
          };
        }).filter((authInfo: AuthInfo) => authInfo.token?.length));
      return {
        ...user,
        authInfo: (newAuthInfo === '[]' ? null : newAuthInfo) as unknown as AuthInfo[],
      };
    });

    return await this.userRepository.save(updateUsers);
  }

  private async getUsers(skip: number, take: number): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .skip(skip)
      .take(take)
      .getMany();
  }

  private validateToken(token: string): boolean {
    const tokenData: string | {[key: string]: unknown} = jwt.decode(token);
    return Date.now() < tokenData['exp'] * 1000;
  }
}
