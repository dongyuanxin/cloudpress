import { Controller, Get, Req, Res } from '@nestjs/common'
import { TimesService } from './times.service';
import { Request, Response } from 'express';
import { asyncLocalStorage } from '../../utils';

@Controller('times')
export class TimesController {
    private readonly viewerTimesCookieKey: string
    private readonly viewerTimesCookieTtl: number

    constructor(
        private readonly timesService: TimesService
    ) {
        this.viewerTimesCookieKey = 'viewertimes'
        this.viewerTimesCookieTtl = 86400000
    }

    @Get('view')
    async logView(@Req() req: Request) {
        const cls = asyncLocalStorage.getStore()
        const times = await this.timesService.logView(cls.requestHostname, req.path)
        return times
    }

    // 注：在 controller 中使用 @Res，需要自己调用 res.end()，否则服务会 handling
    // doc：https://docs.nestjs.cn/7/controllers
    @Get('viewer')
    async logViewer(
        @Req() req: Request,
        @Res() res: Response
    ) {
        const { requestHostname, requestId } = asyncLocalStorage.getStore()
        const resJson = <IResponse>{
            requestId
        }

        try {
            const viewerTimesCookie: string = req.cookies[this.viewerTimesCookieKey] || ''
            const checkRes = this.timesService.checkToken(viewerTimesCookie, requestHostname)
            if (checkRes.valid) {
                resJson.result = checkRes.times
                resJson.code = 0
            } else {
                const times = await this.timesService.logViewer(requestHostname)
                res.cookie(
                    this.viewerTimesCookieKey,
                    this.timesService.getToken(requestHostname, times),
                    {
                        maxAge: this.viewerTimesCookieTtl,
                        httpOnly: true
                    }
                )
                resJson.result = times
                resJson.code = 0
            }
        } catch (error) {
            resJson.code = 500
            resJson.errMsg = error.message
        }

        res.json(resJson).end()
    }
}