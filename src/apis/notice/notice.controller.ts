import {
    Controller,
    Get,
    Query,
    ValidationPipe,
    UsePipes,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { DescribeNoticesDto } from './notice.dto';

@Controller('notice')
export class NoticeController {
    constructor(private readonly noticeService: NoticeService) {}

    @Get()
    async describeNotices(
        @Query(new ValidationPipe({ whitelist: true, transform: true }))
        query: DescribeNoticesDto,
    ) {
        const { startTime, size } = query;
        const noticesRet = await this.noticeService.describeNotices(
            startTime,
            size,
        );
        return noticesRet;
    }
}
