import { AppDto } from './app.dto';

export class ApplicationDto {
  constructor(
    public id: number,
    public name: string,
    public restApiKey: string,
    public oneSignalId: string,
    public app: AppDto[],
    public status: number,
  ) {}
}
