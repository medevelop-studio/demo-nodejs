import { HttpStatus, Injectable } from '@nestjs/common';
import firebase from 'firebase/app';
import 'firebase/database';
import { config } from '../common/dictionary/firebase';
import { DefaultResponseDto } from '../common/dto/default.response.dto';
import { ListResponseDto } from './dto/list-response.dto';
import { RequestAddAppDto } from './dto/request-add-app.dto';

@Injectable()
export class FirebaseService {
  private firebaseDatabase: firebase.database.Database;

  constructor() {
    firebase.initializeApp(config);
    this.firebaseDatabase = firebase.database();
  }

  public async getAllData(): Promise<ListResponseDto> {
    return (await this.firebaseDatabase.ref('/').once('value')).val();
  }

  public async getById(id: number, node: string): Promise<unknown> {
    return this.firebaseDatabase.ref(node + id).once('value');
  }

  public async addNew(data: RequestAddAppDto): Promise<DefaultResponseDto> {
    await this.firebaseDatabase.ref(`/data/${data.id}`).set({ ...data });

    return new DefaultResponseDto(
      HttpStatus.OK,
      'App has been successfully added.',
    );
  }

  public async activateTemp(id: number, data: RequestAddAppDto): Promise<unknown> {
    return this.firebaseDatabase.ref(`/data/${id}`).set({ ...data });
  }

  public async deleteByID(id: number): Promise<DefaultResponseDto> {
    await this.firebaseDatabase.ref(`/data/${id}`).remove();

    return new DefaultResponseDto(
      HttpStatus.OK,
      `Activation with id ${id} has been successfully removed.`,
    );
  }

  public async updateById(id: number, data: RequestAddAppDto): Promise<DefaultResponseDto> {
    await this.firebaseDatabase.ref(`/data/${id}`).update({ ...data });

    return new DefaultResponseDto(
      HttpStatus.OK,
      `App with id ${id} has been successfully updated.`,
    );
  }
}
