import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as url from 'url';
import * as cookieParser from 'cookie-parser'
import { SERVER_PORT, SERVER_ALLOWED_HOSTS } from './constants/'

const allowAllHosts = SERVER_ALLOWED_HOSTS.includes('*');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: (req, callback) => {
            const { hostname } = url.parse(req || '');
            callback(null, allowAllHosts || SERVER_ALLOWED_HOSTS.includes(hostname));
        },
    });
    app.use(cookieParser());
    await app.listen(SERVER_PORT);
}
bootstrap();
