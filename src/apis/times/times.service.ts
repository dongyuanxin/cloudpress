import { Injectable } from '@nestjs/common'
import { TcbService } from 'src/services/tcb.service';
import { COLLECTION_PAGE_VIEWS, COLLECTION_SITES } from '../../constants';
import { sha256 } from '../../utils';
import { EnvService } from './../../services/env.service';
import * as _ from 'lodash'

@Injectable()
export class TimesService {
    constructor(private readonly tcbService: TcbService,
        private readonly envService: EnvService
    ) { }

    public async describeAndUpdatePageView(
        hostname: string,
        path: string
    ): Promise<number> {
        const collection = this.tcbService.getCollection(COLLECTION_PAGE_VIEWS)
        const _ = this.tcbService.getDB().command

        const timesTotal = await this.checkBeforeDescribeAndUpdatePageView(hostname, path)
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
     * 将hostname+path作为唯一索引，有3种情况：
     *  1. 数据库中有一条数据，那么不用做任何处理
     *  2. 数据库中有超过一条数据，可能由于脏写造成，此时计算总次数，删除原有数据，重新创建
     *  3. 数据库中没有数据，那么创建数据。并发写可能出现脏写，导致多条记录。
     *     不过会在下一次触发logView的时候检查并且修复（进入2的逻辑），保证最终一致性
     */
    private async checkBeforeDescribeAndUpdatePageView(hostname: string, path: string): Promise<number> {
        const collection = this.tcbService.getCollection(COLLECTION_PAGE_VIEWS)

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

    /**
     * hostname是物理索引（唯一）
     *  可能同时创建导致只有一个成功，但数据已经在其它客户端创建成功，重新获取一遍即可
     */
    public async describeAndUpdateTotal(hostname: string, newViewer?: boolean): Promise<{
        totalViewers: number,
        totalViews: number
    }> {
        const collection = this.tcbService.getCollection(COLLECTION_SITES)
        const _ = this.tcbService.getDB().command

        let { data } = await collection.where({ hostname }).get()
        if (data.length === 0) {
            try {
                // 创建成功
                await collection.add({ hostname, totalViewers: 1, totalViews: 1 })
                return { totalViewers: 1, totalViews: 1 }
            } catch (err) {
                // 创建失败可能是由于并发创建导致唯一索引键相同而冲突
                // 此时数据已经在其它客户端创建成功，尝试重新获取一遍即可
                let retryRes = await collection.where({ hostname }).get()
                data = retryRes.data
            }
        }

        const updates: any = { totalViews: _.inc(1) }
        if (newViewer) {
            updates.totalViewers = _.inc(1)
        }
        collection.where({ hostname }).update(updates)

        return {
            totalViewers: data[0].totalViewers,
            totalViews: data[0].totalViews + 1
        }
    }
}