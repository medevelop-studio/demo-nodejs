export interface ListResponseDto {
  readonly data: IData;
}

interface IData {
  [key: string]: string;
}
