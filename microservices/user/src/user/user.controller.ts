import { Controller, UseGuards, Post, Get, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { PermissionDictionary } from '../common/dictionary/permission';
import { UserDictionary } from '../common/dictionary/user';
import { RequestBanUserDto } from './dto/request-ban.dto';
import { DefaultResponseDto } from '../common/dto/default.response.dto';
import { TargetGuard } from '../common/guards/target.guard';
import { PermissionGuard } from '../common/guards/permission.guard';
import { UserDto } from '../common/dto/user.dto';
import { RequestCreateDto } from './dto/request-create.dto';
import { RequestUpdateUserDto } from './dto/request-update.dto';
import { RequestGetUserDto } from './dto/request-find-all.dto';
import { CheckAuthHttpGuard } from '../common/guards/checkAuthHttpGuard';
import { FindAllResponseDto } from './dto/find-all-response.dto';
import { RequestGetLogDto } from './dto/request-log.dto';
import { RequestEditUserDto } from './dto/request-edit.dto';
import { RequestFindOneByUidDto } from './dto/request-find-one-by-uid.dto';
import { RequestWriteLogDto } from './dto/request-write-log.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @UseGuards(CheckAuthHttpGuard)
  @Get('info')
  info(): unknown {
    return { info: [
      { key: 'user/permission', value: { ...PermissionDictionary } },
      { key: 'user/status', value: { ...UserDictionary } },
    ] };
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL))
  @Post('ban')
  ban(@Body() data: RequestBanUserDto): Promise<DefaultResponseDto> {
    return this.userService.ban(data);
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL))
  @Post('delete')
  delete(@Body() data: { userId: number}): Promise<DefaultResponseDto> {
    return this.userService.delete(data.userId);
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_SERVICE_PERMISSION_LEVEL))
  @Get('findOneByUid')
  findOneByUid(@Query() data: RequestFindOneByUidDto): Promise<UserDto> {
    return this.userService.findOneByUid(data);
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL))
  @Get()
  findAll(@Query() data: RequestGetUserDto): Promise<FindAllResponseDto> {
    return this.userService.findAll(data);
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_SERVICE_PERMISSION_LEVEL))
  @Post('cleanExpiredTokens')
  cleanExpiredTokens(): Promise<void> {
    return this.userService.cleanExpiredTokens();
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_SERVICE_PERMISSION_LEVEL))
  @Post('deleteOldUserLogsFromDb')
  deleteOldUserLogsFromDb(): Promise<void> {
    return this.userService.deleteOldUserLogsFromDb();
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL))
  @Post('create')
  create(@Body() data: RequestCreateDto): Promise<UserDto> {
    return this.userService.create(data);
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL))
  @Post('update')
  update(@Body() data: RequestUpdateUserDto): Promise<UserDto> {
    return this.userService.update(data);
  }

  @UseGuards(CheckAuthHttpGuard, TargetGuard)
  @Post('edit')
  edit(@Body() data: RequestEditUserDto): Promise<UserDto> {
    return this.userService.edit(data);
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL))
  @Get('/accountLogs')
  async getAccountElasticLogs(@Query() data: RequestGetLogDto): Promise<unknown> {
    return await this.userService.getLogs({ ...data, isUserAccountLog: true });
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL))
  @Get('/serviceLogs')
  async getServiceElasticLogs(@Query() data: RequestGetLogDto): Promise<unknown> {
    return await this.userService.getLogs({ ...data, isUserAccountLog: false });
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_SERVICE_PERMISSION_LEVEL))
  @Post('/writeLog')
  writeLog(@Body() data: RequestWriteLogDto): void {
    this.userService.writeToLog(data);
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL))
  @Get('/genUsers')
  geUsers(@Query() data: {limit: number}): void {
    this.userService.createUsersForTests(data.limit);
  }
}
