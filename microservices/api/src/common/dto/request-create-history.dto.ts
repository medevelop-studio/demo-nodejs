export class RequestCreateHistoryDto {
  constructor(
    public appId: number,
    public userId: number,
    public ip?: string,
  ) {}
}
