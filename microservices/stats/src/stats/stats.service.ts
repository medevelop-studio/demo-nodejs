import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Finder } from '../common/base/finder';
import { StatsLifeCycleDictionary } from '../common/dictionary/stats';
import { DefaultResponseDto } from './dto/default.response.dto';
import { RequestGetStatsDto } from './dto/request-get.dto';
import { StatsDto } from './dto/stats.dto';
import { Stats } from './entities/stats.entity';
import { StatsNoDid } from './entities/stats-no-did.entity';
import { StatsUnique } from './entities/stats-unique.entity';
import { AppStats, ResponseStatsDto } from './dto/response-get-stats.dto';
import { RequestGetUniqueCountDto } from './dto/request-get-unique-count.dto';
import { AppModule } from '../app.module';
import { RequestGetLogDto } from './dto/request-get-log.dto';

@Injectable()
export class StatsService {
  private finder: Finder<Stats>;

  constructor(
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
    @InjectRepository(StatsNoDid)
    private readonly statsNoDidRepository: Repository<StatsNoDid>,
    @InjectRepository(StatsUnique)
    private readonly statsUniqueRepository: Repository<StatsUnique>,
  ) {
    this.finder = new Finder(statsRepository);
  }

  public async set(): Promise<DefaultResponseDto> {
    const currentDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
    const uniqueKey: string = `${currentDate}`;

    await this.statsRepository.query(
      `INSERT INTO "stats"
      (
        "uniqueKey",
        "createDate",
        "updateDate",
        "version"
      )
      VALUES
      (
        '${uniqueKey}',
        '${currentDate.toDateString()}',
        now(),
        '1'
      )
      on conflict("uniqueKey")
      do UPDATE SET
      ""`,
    );

    return new DefaultResponseDto(HttpStatus.OK, 'App has been successfully added to the statistics.');
  }

  public async get(data: RequestGetStatsDto): Promise<StatsDto[]> {
    if ((data.dateFrom && data.dateTo) && (data.dateFrom > data.dateTo)) {
      throw new HttpException('DateTo can not be less than DateFrom.', HttpStatus.FORBIDDEN);
    }

    const query: SelectQueryBuilder<Stats> = this.statsRepository.createQueryBuilder('stats');

    if (data.dateFrom) {
      if (data.dateFrom > new Date()) {
        throw new HttpException('DateFrom can not be greater than now.', HttpStatus.FORBIDDEN);
      }

      query.andWhere('stats.createDate >= :df', { df: data.dateFrom });
    }

    if (data.dateTo) {
      query.andWhere('stats.createDate <= :dt', { dt: data.dateTo });
    }

    query.andWhere('stats.lifeCycle = :lifeCycle', { lifeCycle: StatsLifeCycleDictionary.STATS_ACTIVE });

    return query.getRawMany();
  }

  public async getLogs(data: RequestGetLogDto): Promise<unknown> {
    try {
      const scrollTimeLimit: string = '30m';
      let scrollId: string = '';
      let logs = [];
      let totalAmount: number = 0;

      const scrollOption = {
        scrollId: data.scrollId,
        scroll: scrollTimeLimit,
      };

      const { body } = await AppModule.elasticClient.scroll(scrollOption);

      logs = [...body.hits.hits];
      totalAmount = body.hits.total.value;
      scrollId = body._scroll_id;


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

  public async getStats(): Promise<ResponseStatsDto> {
    const [
      statsByCountry,
      statsByRegion,
    ]: [
      AppStats[],
      AppStats[],
    ] = await Promise.all([
      this.statsUniqueRepository
        .createQueryBuilder('statsUnique')
        .innerJoinAndSelect('statsUnique.country', 'country')
        .select('country.fullName', 'selectedName')
        .getRawMany(),

      this.statsUniqueRepository
        .createQueryBuilder('statsUnique')
        .innerJoinAndSelect('statsUnique.region', 'region')
        .select('region.fullName', 'selectedName')
        .getRawMany(),
    ]);

    return new ResponseStatsDto(statsByCountry, statsByRegion);
  }

  public async getStatsUniqueCount(data: RequestGetUniqueCountDto): Promise<Array<{id: number, count: number}>> {
    if (!data.ids || data.ids.length === 0) {return [];}

    const query = this.statsUniqueRepository.createQueryBuilder('statsUnique')
      .where(`${data.type}.id IN (:...id)`, { id: data.ids });

    query.groupBy(`${data.type}.id`);

    const countOfStatsUnique: Array<{ id: number, count: number }> = await query.getRawMany();

    return data.ids.map(item => ({ id: item, count: countOfStatsUnique.find(elem => elem.id === item)?.count ?? 0 }));
  }
}
