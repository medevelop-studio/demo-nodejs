import { Repository } from 'typeorm';
import { KeyValueDto } from '../dto/key-value.dto';

export class Finder<T> {
  constructor(private repository: Repository<T>) {}

  public async findOneByParam(key: string, value: unknown, relations?: string[]): Promise<T | null> {
    return this.repository.findOne({
      relations,
      where: {
        [key]: value,
      },
    });
  }

  public async findAllByParams(keyValue: KeyValueDto[], relations?: string[]): Promise<T[]| null> {
    const queryObj = {};

    keyValue.forEach((item) => {
      queryObj[item.key] = item.value;
    });

    return this.repository.find({
      relations,
      where: queryObj,
    });
  }
}
