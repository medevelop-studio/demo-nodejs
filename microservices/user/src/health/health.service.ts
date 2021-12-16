import { Injectable } from '@nestjs/common';
import { getConnection, QueryRunner } from 'typeorm';
import { HealthCheckResponseDto, ServingStatus } from './dictionary/health';

@Injectable()
export class HealthService {
  public async check(): Promise<HealthCheckResponseDto> {
    const connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    let status: ServingStatus;

    try {
      const resp: unknown[] = await queryRunner.query('select 1');

      queryRunner.release();

      if (resp.length) {
        status = ServingStatus.SERVING;
      } else {
        status = ServingStatus.NOT_SERVING;
      }
    } catch {
      status = ServingStatus.NOT_SERVING;
    }

    return { status };
  }
}
