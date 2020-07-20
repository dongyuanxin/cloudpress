import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    Injectable,
    Scope,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { TracingService } from 'src/common/tracing/tracing.service';
import { Response } from 'express';
import { inspect } from 'util';

interface HttpExceptionResponseSchema {
    message: string;
    statusCode: number;
    error: string;
}

function isError(error: any): error is Error {
    return error instanceof Error;
}

function isHttpExceptionResponse(
    response: any,
): response is HttpExceptionResponseSchema {
    return typeof response.message === 'string';
}

@Injectable({ scope: Scope.REQUEST })
@Catch()
export class AllExceptionFilter<T> implements ExceptionFilter {
    constructor(private readonly tracingService: TracingService) {}

    catch(exception: T, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res: Response = ctx.getResponse();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        console.log(
            inspect(
                {
                    type: 'ExceptionResponse',
                    requestId: this.tracingService.requestId,
                    status,
                    exception,
                },
                {
                    breakLength: Infinity,
                },
            ),
        );

        let msg: any;
        if (exception instanceof HttpException) {
            // Nestjs内置错误
            const exceptionResponse = exception.getResponse();
            if (isHttpExceptionResponse(exceptionResponse)) {
                // 代码中直接抛出内置错误
                msg = exceptionResponse.message;
            } else {
                // 代码中抛出错误的时候，改写了错误信息
                msg = inspect(exceptionResponse);
            }
        } else if (isError(exception)) {
            // 直接抛出异常
            msg = exception.message;
        } else {
            // 未知问题
            msg = 'UNKNOWN_ERROR';
        }

        res.status(status).json({
            code: status,
            requestId: this.tracingService.requestId,
            msg,
        });
    }
}
