import { Injectable } from '@nestjs/common';
import { DescribeNoticesReturn } from './notice.interface';
import { TcbService } from './../../services/tcb.service';
import { COLLECTION_NOTICES } from './../../constants/'

@Injectable()
export class NoticeService {
    constructor(private tcbService: TcbService) { }

    async describeNotices(
        startTime: number,
        size: number,
    ): Promise<DescribeNoticesReturn> {
        const db = this.tcbService.getDB();
        const collection = this.tcbService.getCollection(COLLECTION_NOTICES);

        const { data } = await collection
            .where({
                noticeTime: db.command.gt(new Date(startTime)),
            })
            .orderBy('noticeTime', 'desc')
            .limit(size)
            .field({
                _id: true,
                noticeTitle: true,
                noticeContent: true,
                noticeTime: true,
            })
            .get();

        return {
            notices: data,
            count: data.length,
        };
    }
}
