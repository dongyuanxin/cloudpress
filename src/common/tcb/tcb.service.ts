import { Injectable, Inject } from '@nestjs/common';
import { TcbConfigSchema } from './tcb.interface';

import tcb = require('@cloudbase/node-sdk');
import { CloudBase } from '@cloudbase/node-sdk/lib/cloudbase';
import { Db } from '@cloudbase/database';

@Injectable()
export class TcbService {
    private readonly app: CloudBase;

    private readonly db: Db;

    constructor(
        @Inject('TCB_CONFIG') private readonly tcbConfig: TcbConfigSchema,
    ) {
        this.app = tcb.init(this.tcbConfig);
        this.db = this.app.database();
    }

    public getApp() {
        return this.app;
    }

    public getDB() {
        return this.db;
    }

    public getCollection(collectionName: string) {
        return this.db.collection(collectionName);
    }
}
