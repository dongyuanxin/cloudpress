import { Injectable } from '@nestjs/common';
import { EnvService } from './env.service';
import * as tcb from '@cloudbase/node-sdk';
import { CloudBase } from '@cloudbase/node-sdk/lib/cloudbase';
import { Db } from '@cloudbase/database';

@Injectable()
export class TcbService {
    private readonly app: CloudBase;

    private readonly db: Db;

    constructor(
        private readonly envService: EnvService
    ) {
        this.app = tcb.init({
            secretId: this.envService.getEnvironmentVariable('TCLOUD_SECRET_ID'),
            secretKey: this.envService.getEnvironmentVariable('TCLOUD_SECRET_KEY'),
            env: this.envService.getEnvironmentVariable('TCB_ENV_ID')
        })

        this.db = this.app.database()
    }

    public getApp() {
        return this.app
    }

    public getDB() {
        return this.db
    }

    public getCollection(colName: string) {
        return this.db.collection(colName)
    }
}