import { Controller, ValidationPipe, Body, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchPassagesDto } from './search.dto';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Post('/passages')
    async searchPassages(
        @Body(
            new ValidationPipe({
                whitelist: true,
                transform: true,
            }),
        )
        body: SearchPassagesDto,
    ) {
        return body;
    }
}
