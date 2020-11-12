import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeoController } from './apis/seo/seo.controller';
import { NoticeController } from './apis/notice/notice.controller';
import { configInstance } from './env';
import { TcbModule } from './common/tcb/tcb.module';
import { NoticeService } from './apis/notice/notice.service';
import { ClsMiddleware } from './middlewares/cls.middleware';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { SearchController } from './apis/search/search.controller';
import { SearchService } from './apis/search/search.service';
import { LoggerService } from './services/logger.service';
import { PassageController } from './apis/passage/passage.controller';
import { PassageService } from './apis/passage/passage.service';
import { LocalCacheService } from './services/local-cache.service';
import { EnvService } from './services/env.service';

configInstance.loadConfig();

@Module({
    imports: [
        TcbModule.forRoot({
            env: configInstance.read('ENV_ID'),
            secretId: configInstance.read('TCB_SECRET_ID'),
            secretKey: configInstance.read('TCB_SECRET_KEY'),
        }),
    ],
    controllers: [
        AppController,
        SeoController,
        NoticeController,
        SearchController,
        PassageController,
    ],
    providers: [
        AppService,
        NoticeService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionFilter,
        },
        SearchService,
        LoggerService,
        PassageService,
        LocalCacheService,
        EnvService,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        const globalMiddlewares = [ClsMiddleware];
        consumer.apply(...globalMiddlewares).forRoutes('*');
    }
}
