import {
    Controller,
    Get,
    Query,
    ValidationPipe,
    UsePipes,
} from '@nestjs/common';
import { PassageService } from './passage.service';

@Controller('notice')
export class PassageController {
    constructor(private readonly passageService: PassageService) {
        this.passageService.load()
    }
}
