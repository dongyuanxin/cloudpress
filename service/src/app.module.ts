import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeoController } from './apis/seo/seo.controller';
import { NoticeController } from './apis/notice/notice.controller';
import { configInstance } from './env';
import { TcbModule } from './common/tcb/tcb.module';
import { NoticeService } from './apis/notice/notice.service';
import { TracingService } from './common/tracing/tracing.service';
import { LogMiddleware } from './middlewares/log.middleware';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { AllExceptionFilter } from './filters/all-exception.filter';

configInstance.loadConfig();

@Module({
    imports: [
        TcbModule.forRoot({
            env: configInstance.read('ENV_ID'),
            secretId: configInstance.read('TCB_SECRET_ID'),
            secretKey: configInstance.read('TCB_SECRET_KEY'),
        }),
    ],
    controllers: [AppController, SeoController, NoticeController],
    providers: [
        AppService,
        NoticeService,
        TracingService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionFilter,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LogMiddleware).forRoutes('*');
    }
}
