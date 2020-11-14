import { Injectable } from '@nestjs/common'
import { TcbService } from 'src/services/tcb.service';
import { COLLECTION_VIEWS } from '../../constants';

@Injectable()
export class TimesService {
    constructor(private readonly tcbService: TcbService) { }

    async logView(
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
     * 将hostname+path作为索引，有3种情况：
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
}