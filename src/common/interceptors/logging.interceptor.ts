import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createLogger } from '../logger/logger.config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = createLogger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.info({
          method,
          url,
          duration: `${Date.now() - now}ms`,
        });
      }),
    );
  }
}
