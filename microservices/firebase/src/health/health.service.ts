import { Injectable } from '@nestjs/common';
import { HealthCheckResponseDto, ServingStatus } from './dictionary/health';

@Injectable()
export class HealthService {
  public async check(): Promise<HealthCheckResponseDto> {
    const status: ServingStatus = ServingStatus.SERVING;

    return { status };
  }
}
