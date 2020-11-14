import { Injectable } from '@nestjs/common'
import { TcbService } from 'src/services/tcb.service';
import { COLLECTION_VIEWS, COLLECTION_VIEWERS } from '../../constants';
import { sha256 } from '../../utils';
import { EnvService } from './../../services/env.service';
import * as _ from 'lodash'

@Injectable()
export class TimesService {
    constructor(private readonly tcbService: TcbService,
        private readonly envService: EnvService
    ) { }

    public async logView(
        hostname: string,
        path: string
    ): Promise<number> {
        const collection = this.tcbService.getCollection(COLLECTION_VIEWS)
        const _ = this.tcbService.getDB().command

        const timesTotal = await this.checkBeforeLogView(hostname, path)
        // 异步更新，减少阻塞时间
        collection.where({
            hostname,
            path
        })
            .update({
                times: _.inc(1)
            })
        return timesTotal + 1
    }

    /**
     * 将hostname+path作为逻辑索引，有3种情况：
     *  1. 数据库中有一条数据，那么不用做任何处理
     *  2. 数据库中有超过一条数据，可能由于脏写造成，此时计算总次数，删除原有数据，重新创建
     *  3. 数据库中没有数据，那么创建数据。并发写可能出现脏写，导致多条记录。
     *     不过会在下一次触发logView的时候检查并且修复（进入2的逻辑），保证最终一致性
     */
    private async checkBeforeLogView(hostname: string, path: string): Promise<number> {
        const collection = this.tcbService.getCollection(COLLECTION_VIEWS)

        const { data } = await collection.where({
            hostname,
            path
        }).get()
        const total = data.length

        if (total === 1) {
            return data[0].times
        }

        let timesTotal = 0
        if (total > 1) {
            for (const item of data) {
                timesTotal += (item.times) || 1
            }

            await collection.where({
                hostname,
                path
            }).remove()
        }

        await collection.add({
            hostname,
            path,
            times: timesTotal
        })

        return timesTotal
    }

    public async logViewer(hostname: string): Promise<number> {
        const collection = this.tcbService.getCollection(COLLECTION_VIEWERS)
        const _ = this.tcbService.getDB().command

        const people = await this.checkBeforeLogViewer(hostname)
        collection.where({ hostname })
            .update({
                times: _.inc(1)
            })
        return people
    }

    /**
     * hostname是物理索引（唯一）
     *  可能同时创建导致只有一个成功，但数据已经在其它客户端创建成功，重新获取一遍即可
     */
    private async checkBeforeLogViewer(hostname: string): Promise<number> {
        const collection = this.tcbService.getCollection(COLLECTION_VIEWERS)

        let { data } = await collection.where({ hostname }).get()
        if (data.length === 0) {
            try {
                // 创建成功
                await collection.add({ hostname, times: 0 })
                return 0
            } catch (err) {
                // 创建失败是由于并发创建导致唯一索引键相同而冲突
                // 此时数据已经在其它客户端创建成功，重新获取一遍即可
                let retryRes = await collection.where({ hostname }).get()
                data = retryRes.data
            }
        }
        return data[0].times
    }

    public getToken(hostname: string, times: number): string {
        const token = sha256(`${hostname}${times}`, this.envService.getEnvironmentVariable('TOKEN_SECRET'))
        return `${hostname},${times},${token}`
    }

    public checkToken(cookie: string, hostname: string): {
        valid: boolean,
        times: number
    } {
        const infos: string[] = cookie.split(',')
        if (infos.length !== 3) {
            return {
                valid: false,
                times: 0
            }
        }

        const [domain, times, token] = infos
        if (domain !== hostname) {
            return {
                valid: false,
                times: 0
            }
        }

        const timesNum = Number(times)
        if (_.isInteger(timesNum) === false || timesNum < 0) {
            return {
                valid: false,
                times: 0
            }
        }

        if (token !==
            sha256(
                `${domain}${times}`,
                this.envService.getEnvironmentVariable('TOKEN_SECRET')
            )
        ) {
            return {
                valid: false,
                times: 0
            }
        }

        return {
            valid: true,
            times: timesNum
        }
    }
}