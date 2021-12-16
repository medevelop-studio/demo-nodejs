import { StatsEnum } from '../dictionary/stats';
import { ApplicationDto } from './application.dto';
import { CountryDto } from './country.dto';
import { RegionDto } from './region.dto';

export class AppDto {
  constructor(
    public id: number,
    public uptime: number,
    public host: string,
    public requestTime: Date,
    public country: CountryDto,
    public region: RegionDto,
    public application: ApplicationDto,
    public city: string,
    public postalCode: string,
    public version: string,
    public status: StatsEnum,
    public createDate: Date,
    public count?: number,
  ) {}
}
