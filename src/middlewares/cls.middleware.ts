import { Injectable, NestMiddleware } from '@nestjs/common';
import { uuidV4, asyncLocalStorage } from './../utils/';
import { Request, Response } from 'express';
import { LoggerService } from 'src/services/logger.service';

@Injectable()
export class ClsMiddleware implements NestMiddleware {
    constructor(private readonly logger: LoggerService) { }

    use(req: Request, res: Response, next: () => void) {
        const cls: ICls = {
            requestId: uuidV4(),
            requestTime: Date.now(),
            requestMethod: req.method,
            requestPath: req.originalUrl,
            requestHostname: req.hostname,
        };

        asyncLocalStorage.run(cls, () => {
            this.logger.info({ logType: 'IncomingRequest' });
            next();
        });
    }
}
