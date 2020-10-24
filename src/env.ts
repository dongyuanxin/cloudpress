import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

interface ConfigSchema {
    [key: string]: any;
}

export class Config {
    private readonly mode: string;
    private cache: ConfigSchema;

    constructor(mode: string) {
        this.mode = mode;
        this.cache = null;
    }

    public loadConfig(): void {
        // 避免重复加载
        if (this.cache) {
            return;
        }

        // 如果是生产环境，一些所需的信息会通过CI工具注入到process.env中
        if (this.mode === 'production') {
            this.cache = process.env;
            return;
        }

        // 本地开发环境，需要读取项目目录中的 .env 文件
        const filepath = path.join(__dirname, '..', '.env');
        if (!fs.existsSync(filepath)) {
            throw new Error(`Please create configuration file: ${filepath}`);
        }

        const localEnv = dotenv.config({ path: filepath }).parsed;
        this.cache = {
            ...process.env,
            ...localEnv,
        };
    }

    public read(key: string): string {
        return this.cache[key];
    }

    public put(key: string, value: any): void {
        this.cache[key] = value;
    }
}

export const configInstance = new Config(process.env.NODE_ENV);
