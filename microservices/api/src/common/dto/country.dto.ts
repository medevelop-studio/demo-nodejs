import { AppDto } from './app.dto';

export class CountryDto {
  constructor(
    public id: number,
    public fullName: string,
    public shortName: string,
    public app: AppDto[],
  ) {}
}
