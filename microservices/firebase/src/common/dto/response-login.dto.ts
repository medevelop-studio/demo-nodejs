export class ResponseLoginDto {
  response: {
    id: number;
    login: string;
    password: string;
    token: string;
    permissionLevel: string;
    status: number;
    createDate: Date;
    updateDate: Date;
    version: number;
  };

  status: number;
}
