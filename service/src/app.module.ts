import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeoController } from './apis/seo/seo.controller';
import { NoticeController } from './apis/notice/notice.controller';
import { configInstance } from './env'
import { TcbModule } from './common/tcb/tcb.module';
import { NoticeService } from './apis/notice/notice.service';

configInstance.loadConfig()

@Module({
    imports: [
        TcbModule.forRoot({
            env: configInstance.read('ENV_ID'),
            secretId: configInstance.read('TCB_SECRET_ID'),
            secretKey: configInstance.read('TCB_SECRET_KEY'),
        })
    ],
    controllers: [AppController, SeoController, NoticeController],
    providers: [AppService, NoticeService],
})
export class AppModule { }
