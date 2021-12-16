import { Controller, Post, UseGuards, Get, Query } from '@nestjs/common';
import { CheckAuthHttpGuard } from '../common/check.strategy';
import { PermissionDictionary } from '../common/dictionary/permission';
import { PermissionGuard } from '../common/guards/permission.guard';
import { DefaultResponseDto } from './dto/default.response.dto';
import { RequestGetLogDto } from './dto/request-get-log.dto';
import { RequestGetUniqueCountDto } from './dto/request-get-unique-count.dto';
import { RequestGetStatsDto } from './dto/request-get.dto';
import { ResponseStatsDto } from './dto/response-get-stats.dto';
import { StatsDto } from './dto/stats.dto';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
  ) {}

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_SERVICE_PERMISSION_LEVEL))
  @Post('set')
  set(): Promise<DefaultResponseDto> {
    return this.statsService.set();
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL))
  @Get()
  async get(@Query() data: RequestGetStatsDto): Promise<StatsDto[]> {
    return this.statsService.get(data);
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_SERVICE_PERMISSION_LEVEL))
  @Get('getStats')
  async getStats(): Promise<ResponseStatsDto> {
    return this.statsService.getStats();
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_ADMIN_PERMISSION_LEVEL))
  @Get('/logs')
  async getElasticLogs(@Query() data: RequestGetLogDto): Promise<unknown> {
    return await this.statsService.getLogs(data);
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_SERVICE_PERMISSION_LEVEL))
  @Get('/getStatsUniqueCount')
  getStatsUniqueCount(@Query() data: RequestGetUniqueCountDto): Promise<Array<{id: number, count: number}>> {
    return this.statsService.getStatsUniqueCount(data);
  }
}
