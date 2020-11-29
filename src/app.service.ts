import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello Cloudpress! View demo at: https://xxoo521.com/';
    }
}
