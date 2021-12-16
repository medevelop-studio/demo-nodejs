import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { HealthInterceptor } from '../common/interceptor/health-interceptor';
import { HealthCheckResponseDto } from './dictionary/health';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @UseInterceptors(new HealthInterceptor())
  @Get('/check')
  public check(): Promise<HealthCheckResponseDto> {
    return this.healthService.check();
  }
}
