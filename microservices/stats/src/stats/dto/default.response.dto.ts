export class DefaultResponseDto {
  constructor(statusCode: number, message: string) {
    return {
      statusCode,
      message,
    };
  }
  statusCode: number;
  message: string;
}
