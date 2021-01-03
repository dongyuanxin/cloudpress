import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello Cloudpress! View demo at: https://xin-tan.com/';
    }
}
