export class AppDto {
  constructor(
    public id: number,
    public name: string,
    public restApiKey: string,
    public oneSignalId: string,
    public apps: string[],
    public status: number,
  ) {}
}
