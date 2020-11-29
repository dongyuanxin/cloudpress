import {
    Controller,
    Get,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { PassageService } from './passage.service';
import { DescribePassageByIdDto, DescribePassagesDto } from './passage.dto';

@Controller('passage')
export class PassageController {
    constructor(private readonly passageService: PassageService) {
        this.passageService.load()
    }

    @Get('describe-passage-by-id')
    async describePassageById(
        @Query(new ValidationPipe({ whitelist: false }))
        query: DescribePassageByIdDto
    ) {
        const { passageId } = query
        return await this.passageService.describePassageById(passageId);
    }

    @Get('describe-passages')
    async describePassages(
        @Query(new ValidationPipe({ whitelist: true, transform: true }))
        query: DescribePassagesDto
    ) {
        const { limit, page } = query
        return await this.passageService.describePassages(limit, page)
    }

    @Get('count-all-passages')
    async countAllPassages() {
        return await this.passageService.countAllPassages()
    }

    @Get('describe-all-passage-ids')
    async describeAllPassageIds() {
        return await this.passageService.describeAllPassageIds()
    }
}
