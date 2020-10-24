import { Controller, ValidationPipe, Body, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchPassagesDto } from './search.dto';
import { SearchPassagesReturn } from './search.interface';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Post('/passages')
    async searchPassages(
        @Body(new ValidationPipe({ whitelist: true, transform: true }))
        body: SearchPassagesDto,
    ): Promise<SearchPassagesReturn> {
        const { page, size, keywords } = body;
        keywords.forEach((_, index) => {
            keywords[index] = keywords[index].trim();
        });

        if (keywords.length === 0) {
            return {
                count: 0,
                passages: [],
            };
        }

        return await this.searchService.searchPassages(page, size, keywords);
    }
}
