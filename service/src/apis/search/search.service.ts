import { Injectable } from '@nestjs/common';
import { TcbService } from 'src/common/tcb/tcb.service';
import { COLLECTION_PASSAGES } from './../../contants';
import { SearchPassagesReturn } from './search.interface';

@Injectable()
export class SearchService {
    constructor(private tcbService: TcbService) {}

    async searchPassages(
        page: number,
        size: number,
        keywords: string[],
    ): Promise<SearchPassagesReturn> {
        const db = this.tcbService.getDB();
        const collection = this.tcbService.getCollection(COLLECTION_PASSAGES);
        const _ = db.command;

        const rule = new RegExp(keywords.join('|'));

        const query = _.and([
            {
                isPublished: true,
            },
            _.or([{ content: rule }, { title: rule }]),
        ]);

        const { total } = await collection.where(query).count();
        const { data } = await collection
            .where(query)
            .skip((page - 1) * size)
            .limit(size)
            .field({
                _id: false,
                title: true,
                psgID: true,
                content: true,
                publishTime: true,
                goodTimes: true,
            })
            .get();

        return {
            count: total,
            passages: data,
        };
    }
}
