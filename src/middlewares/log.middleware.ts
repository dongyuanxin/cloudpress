import { Injectable, NestMiddleware } from '@nestjs/common';
import { TracingService } from 'src/common/tracing/tracing.service';
import { inspect } from 'util';
import { Request, Response } from 'express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
    constructor(private readonly tracingService: TracingService) {}

    use(req: Request, res: Response, next: () => void) {
        console.log(
            inspect(
                {
                    type: 'IncomingRequest',
                    requestId: this.tracingService.requestId,
                    reqTime: this.tracingService.reqTime,
                    method: req.method,
                    url: req.originalUrl,
                    body: req.body,
                    query: req.query,
                },
                {
                    breakLength: Infinity,
                },
            ),
        );
        next();
    }
}
