export class ApiErrorDto {
  constructor(
    public code: number,
    public data?: string,
  ) {}
}
