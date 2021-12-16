export class RequestSetErrorDto {
  constructor(
    public historyId: number,
    public error?: string,
  ) {}
}
