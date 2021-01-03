import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { LoggerService } from './logger.service';

const ENV_KEYS = {
    NODE_ENV: 'NODE_ENV',
    TCB_ENV_ID: 'TCB_ENV_ID',
    TCLOUD_SECRET_ID: 'TCLOUD_SECRET_ID',
    TCLOUD_SECRET_KEY: 'TCLOUD_SECRET_KEY',
    TOKEN_SECRET: 'TOKEN_SECRET',
    ENABLE_UPLOAD: 'ENABLE_UPLOAD'
} as const;

export type ENV_KEYS_TYPE = keyof typeof ENV_KEYS;

@Injectable()
export class EnvService {
    constructor(private readonly loggerService: LoggerService) {
        this.loadEnv();
    }

    public getEnvironmentVariable(key: ENV_KEYS_TYPE) {
        return process.env[key];
    }

    public isDevMode() {
        const mode = process.env['NODE_ENV'] || 'development';
        return ['dev', 'development'].includes(mode);
    }

    private loadEnv() {
        const envPath = path.join(process.cwd(), '.env');
        if (!this.isDevMode()) {
            return this.loggerService.info({
                logType: 'EnvLoadPass',
                content: `Don't load ${envPath} without development mode`,
            });
        }

        const isExist = fs.existsSync(envPath);
        if (!isExist) {
            return this.loggerService.info({
                logType: 'EnvLoadFail',
                content: `Please create ${envPath}`,
            });
        }

        const { parsed } = dotenv.config({ path: envPath });
        const envs = <Record<ENV_KEYS_TYPE, string>>parsed;
        for (let key in envs) {
            process.env[key] = envs[key];
        }

        this.loggerService.info({
            logType: 'EnvLoadSuccess',
            content: `Load ${envPath} in development mode`,
        });
    }
}
