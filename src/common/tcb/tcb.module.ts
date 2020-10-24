import { Module, DynamicModule } from '@nestjs/common';
import { TcbService } from './tcb.service';
import { TcbConfigSchema } from './tcb.interface';

@Module({})
export class TcbModule {
    static forRoot(config: TcbConfigSchema): DynamicModule {
        return {
            module: TcbModule,
            providers: [
                {
                    provide: 'TCB_CONFIG',
                    useValue: config,
                },
                TcbService,
            ],
            exports: [TcbService],
        };
    }
}
