import { UserDto } from '../../common/dto/user.dto';

export class FindAllResponseDto {
  constructor(users: UserDto[], totalCount: number, pageNumber: number, amountPerPage: number) {
    return {
      totalCount,
      pageNumber,
      amountPerPage,
      users,
    };
  }
  users: UserDto[];
  totalCount: number;
  pageNumber: number;
  amountPerPage: number;
}
