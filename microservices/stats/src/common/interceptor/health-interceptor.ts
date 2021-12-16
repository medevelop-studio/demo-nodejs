import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServingStatus } from '../../health/dictionary/health';

@Injectable()
export class HealthInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      map(data => {
        if (data?.status !== ServingStatus.SERVING) {
          context.switchToHttp().getResponse().status(HttpStatus.SERVICE_UNAVAILABLE);
        }

        return data;
      }),
    );
  }
}
