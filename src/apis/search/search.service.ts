import { Injectable } from '@nestjs/common';
import { TcbService } from './../../services/tcb.service';
import { COLLECTION_PASSAGES } from './../../constants/';
import { SearchPassagesReturn } from './search.interface';
import { PassageSchema } from '../passage/passage.interface';

@Injectable()
export class SearchService {
    constructor(private tcbService: TcbService) { }

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
            // todo
            // {
            //     isPublished: true,
            // },
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
                content: true,
                permalink: true,
            })
            .get();

        return {
            count: total,
            passages: data.map((psg: PassageSchema) => ({
                ...psg,
                content: psg.content.slice(0, 80)
            })),
        };
    }
}
