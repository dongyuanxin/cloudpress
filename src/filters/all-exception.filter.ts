import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Injectable
} from '@nestjs/common';
import { Response } from 'express';
import { inspect } from 'util';
import { asyncLocalStorage } from './../utils/';
import { LoggerService } from 'src/services/logger.service';

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

@Injectable()
@Catch()
export class AllExceptionFilter<T> implements ExceptionFilter {
    constructor(private readonly loggerService: LoggerService) { }

    catch(exception: T, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res: Response = ctx.getResponse();

        const errStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let errMsg: string;
        let errStack: string;
        if (exception instanceof HttpException) {
            // 如果是 NestJS 内置错误
            const exceptionResponse = exception.getResponse();
            errStack = exception.stack;
            if (isHttpExceptionResponse(exceptionResponse)) {
                // 代码中直接抛出内置错误，并且没有改写错误信息
                errMsg = exceptionResponse.message;
            } else {
                // 代码中直接抛出内置错误，并且改写了错误信息
                errMsg = inspect(exceptionResponse);
            }
        } else if (isError(exception)) {
            // 如果是代码中直接抛出了异常
            errMsg = exception.message;
            errStack = exception.stack;
        } else {
            // 未知问题
            errMsg = 'UNKNOWN_ERROR';
            errStack = '';
        }

        this.loggerService.error({
            logType: 'ErrorResponse',
            errMsg,
            errStatus,
            errStack,
        });

        const resJson: IResponse = {
            code: errStatus,
            requestId: asyncLocalStorage.getStore()?.requestId,
            errMsg,
        };
        res.status(200).json(resJson);
    }
}
