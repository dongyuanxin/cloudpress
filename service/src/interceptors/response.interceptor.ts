import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TracingService } from 'src/common/tracing/tracing.service';
import { inspect } from 'util';

// 现象：直接写 @Injectable() 会注入失败，提示undefined
// 原因：TracingService 的作用域是 Scope.REQUEST，如果两个作用域不相同，Ioc容器会自行处理
//      当有请求进来时，拦截器不会获得不同作用域的Provider
// 更多：对于 LogMiddleware 中，是可以直接使用 TracingService，因为LogMiddleware是请求链路上的一个节点
@Injectable({
    scope: Scope.REQUEST,
})
export class ResponseInterceptor implements NestInterceptor {
    constructor(private readonly tracingService: TracingService) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map(result => {
                console.log(
                    inspect({
                        type: 'OutcomingResponse',
                        requestId: this.tracingService.requestId,
                        costTime:
                            Date.now() - this.tracingService.reqTime + ' ms',
                    }),
                );

                return {
                    code: 0,
                    result: result || null,
                    requestId: this.tracingService.requestId,
                };
            }),
        );
    }
}
