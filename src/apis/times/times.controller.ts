import { Controller, Post, Get, Req } from '@nestjs/common'
import { TimesService } from './times.service';
import { Request } from 'express';
import { asyncLocalStorage } from '../../utils';

@Controller('times')
export class TimesController {
    constructor(private readonly timesService: TimesService) { }

    @Get('/view')
    async logView(@Req() req: Request) {
        const cls = asyncLocalStorage.getStore()
        const times = await this.timesService.logView(cls.requestHostname, req.path)
        return times
    }

    @Get('/viewer')
    async logViewer() {

    }
}