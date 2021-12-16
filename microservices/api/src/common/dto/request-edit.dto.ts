export class RequestEditUserDto {
  constructor(
    public userId: number,
    public allowedIps?: string[],
    public password?: string,
    public isSoundsEnable?: boolean,
  ) {}
}
