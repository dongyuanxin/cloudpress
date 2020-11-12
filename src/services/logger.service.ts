import { Injectable } from '@nestjs/common';
import { asyncLocalStorage } from './../utils/';

export type LogLevel = 'info' | 'error' | 'warn';

export interface LogInfo {
    // 请求链路信息
    requestId?: string;
    requestTime?: number;
    requestPath?: string;
    requestMethod?: string;
    requestHostname?: string;

    // 日志属性信息
    logLevel?: LogLevel;
    logType?: string;
    logTime?: number;

    // 错误信息
    errStatus?: number;
    errMsg?: string;
    errStack?: string;

    // http client请求信息
    httpClientConfig?: any;
    httpClientRes?: string;
    httpClientCostTime?: number;

    // 缓存信息
    cacheType?: 'local' | 'redis';
    cacheOperation?: 'create' | 'del' | 'hit' | 'miss';
    cacheKey?: string;
    cacheValue?: string;

    // 其他信息
    costTime?: number;
    content?: string;
}

@Injectable()
export class LoggerService {
    constructor() {}

    public info(logInfo: LogInfo) {
        this.print({
            ...logInfo,
            logLevel: 'info',
        });
    }

    public warn(logInfo: LogInfo) {
        this.print({
            ...logInfo,
            logLevel: 'warn',
        });
    }

    public error(logInfo: LogInfo) {
        this.print({
            ...logInfo,
            logLevel: 'error',
        });
    }

    private print(logInfo: LogInfo) {
        const now = Date.now();
        const _logInfo: LogInfo = {
            logTime: now,
            ...logInfo,
        };

        const cls = asyncLocalStorage.getStore();
        if (cls) {
            Object.assign(_logInfo, {
                ...cls,
                costTime: now - cls.requestTime,
            });
        }
        console.log(JSON.stringify(_logInfo));
    }
}
