import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../entities/application.entity';
import { Country } from '../entities/country.entity';
import { History } from '../entities/history.entity';
import { Region } from '../entities/region.entity';
import { StatsNoDid } from './entities/stats-no-did.entity';
import { StatsUnique } from './entities/stats-unique.entity';
import { StatsController } from './stats.controller';
import { Stats } from './entities/stats.entity';
import { StatsService } from './stats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stats, StatsUnique, StatsNoDid, Application, Country, Region, History]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
