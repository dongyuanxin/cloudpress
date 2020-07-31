import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as url from 'url';

const allowedHosts = ['localhost', 'xxoo521.com', 'www.xxoo521.com'];

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: (req, callback) => {
            const { hostname } = url.parse(req || '');
            callback(null, allowedHosts.includes(hostname));
        },
    });
    await app.listen(80);
}
bootstrap();
