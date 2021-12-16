import { Stats } from '../entities/stats.entity';
import { Application } from '../../entities/application.entity';

export class StatsDto {
  constructor(stats: Stats) {
    return {
      id: stats.id,
      application: stats.application,
      blacklistedByCountries: stats.blacklistedByCountries,
      createDate: new Date(stats.createDate).getTime(),
    };
  }

  id: number;
  application: Application;
  blacklistedByCountries: number;
  createDate: number;
}
