import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { PermissionDictionary } from '../common/dictionary/permission';
import { PermissionGuard } from '../common/guards/permission.guard';
import { DefaultResponseDto } from '../common/dto/default.response.dto';
import { CheckAuthHttpGuard } from '../common/guards/checkAuthHttpGuard';
import { ListResponseDto } from './dto/list-response.dto';
import { RequestAddAppDto } from './dto/request-add-app.dto';
import { FirebaseService } from './firebase.service';

@Controller('firebase')
export class FirebaseController {
  constructor(
    private readonly firebaseService: FirebaseService,
  ) {}

  @UseGuards(CheckAuthHttpGuard)
  @Get()
  hello(): DefaultResponseDto {
    return new DefaultResponseDto(
      HttpStatus.OK,
      'Hello it`s api page.',
    );
  }

  @UseGuards(CheckAuthHttpGuard)
  @Get('list')
  async getList(): Promise<ListResponseDto> {
    return this.firebaseService.getAllData();
  }

  @UseGuards(CheckAuthHttpGuard)
  @Get('list/:id')
  getAppById(@Param('id') id: number): Promise<unknown> {
    return this.firebaseService.getById(id, '/application/');
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_CLIENT_PERMISSION_LEVEL))
  @Post('add')
  add(@Body() data: RequestAddAppDto): Promise<DefaultResponseDto> {
    return this.firebaseService.addNew(data);
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_CLIENT_PERMISSION_LEVEL))
  @Post('delete/:id')
  delete(@Param('id') id: number): Promise<DefaultResponseDto> {
    return this.firebaseService.deleteByID(id);
  }

  @UseGuards(CheckAuthHttpGuard, new PermissionGuard(PermissionDictionary.USER_CLIENT_PERMISSION_LEVEL))
  @Post('update/:id')
  update(@Param('id') id: number, @Body() data: RequestAddAppDto): Promise<DefaultResponseDto> {
    return this.firebaseService.updateById(id, data);
  }
}
