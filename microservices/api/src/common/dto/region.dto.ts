import { AppDto } from './app.dto';

export class RegionDto {
  constructor(
    public id: number,
    public fullName: string,
    public shortName: string,
    public apps: AppDto[],
  ) {}
}
