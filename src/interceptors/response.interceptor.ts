import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService } from 'src/services/logger.service';
import { asyncLocalStorage } from './../utils/';


@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(private readonly loggerService: LoggerService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(result => {
                this.loggerService.info({
                    logType: 'SuccessResponse'
                });

                return {
                    code: 0,
                    result: result || null,
                    // 抛错时，可能异步调用上下文没有创建，此时拿不到requestId
                    requestId: asyncLocalStorage.getStore()?.requestId
                };
            }),
        );
    }
}
