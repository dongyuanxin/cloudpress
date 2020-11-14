import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeoController } from './apis/seo/seo.controller';
import { NoticeController } from './apis/notice/notice.controller';
import { NoticeService } from './apis/notice/notice.service';
import { ClsMiddleware } from './middlewares/cls.middleware';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { SearchController } from './apis/search/search.controller';
import { SearchService } from './apis/search/search.service';
import { LoggerService } from './services/logger.service';
import { PassageController } from './apis/passage/passage.controller';
import { TimesController } from './apis/times/times.controller'
import { PassageService } from './apis/passage/passage.service';
import { LocalCacheService } from './services/local-cache.service';
import { EnvService } from './services/env.service';
import { TcbService } from './services/tcb.service';
import { TimesService } from './apis/times/times.service'

@Module({
    controllers: [
        AppController,
        SeoController,
        NoticeController,
        SearchController,
        PassageController,
        TimesController
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
        TcbService,
        TimesService
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        const globalMiddlewares = [ClsMiddleware];
        consumer.apply(...globalMiddlewares).forRoutes('*');
    }
}
