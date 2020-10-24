import { Injectable, Scope } from '@nestjs/common';
import uniqueString = require('unique-string');

@Injectable({
    scope: Scope.REQUEST,
})
export class TracingService {
    public requestId: string;
    public reqTime: number;

    constructor() {
        this.requestId = uniqueString();
        this.reqTime = Date.now();
    }
}
