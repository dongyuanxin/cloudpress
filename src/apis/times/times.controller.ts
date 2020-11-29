import { Controller, Get, Headers, BadRequestException } from '@nestjs/common'
import { TimesService } from './times.service';
import * as jwt from 'jsonwebtoken'
import { EnvService } from 'src/services/env.service';
import { IncomingHttpHeaders } from 'http';

@Controller('times')
export class TimesController {
    private readonly viewerTimesCookieTtl: string

    constructor(
        private readonly timesService: TimesService,
        private readonly envService: EnvService
    ) {
        this.viewerTimesCookieTtl = '86400000'
    }

    @Get('view')
    async logView(@Headers() headers: IncomingHttpHeaders) {
        if (!headers.host || !headers['x-cloudpress-url']) {
            throw new BadRequestException('来源非法')
        }

        const url = new URL(`${headers.origin}${headers['x-cloudpress-url']}`)
        const secret = this.envService.getEnvironmentVariable('TOKEN_SECRET')

        let token = headers['x-cloudpress-token'] || ''
        let data: {
            domain: string
        } = {} as any
        let newViewer;
        try {
            jwt.verify(token, secret)
            data = jwt.decode(token, secret)
            newViewer = false;
        } catch (err) {
            data = { domain: url.host }
            token = jwt.sign(data, secret, {
                expiresIn: this.viewerTimesCookieTtl
            })
            newViewer = true;
        }

        const { totalViewers, totalViews } = await this.timesService.describeAndUpdateTotal(url.host, newViewer)
        const pageView = await this.timesService.describeAndUpdatePageView(url.host, url.pathname)
        return {
            pageView,
            totalViewers,
            totalViews,
            token
        }
    }

    // 注：在 controller 中使用 @Res，需要自己调用 res.end()，否则服务会 handling
    // doc：https://docs.nestjs.cn/7/controllers
    // @Get('viewer')
    // async logViewer(
    //     @Req() req: Request,
    //     @Res() res: Response
    // ) {
    //     const { requestHostname, requestId } = asyncLocalStorage.getStore()
    //     const resJson = <IResponse>{
    //         requestId
    //     }

    //     try {
    //         const viewerTimesCookie: string = req.cookies[this.viewerTimesCookieKey] || ''
    //         const checkRes = this.timesService.checkToken(viewerTimesCookie, requestHostname)
    //         if (checkRes.valid) {
    //             resJson.result = checkRes.times
    //             resJson.code = 0
    //         } else {
    //             const times = await this.timesService.logViewer(requestHostname)
    //             res.cookie(
    //                 this.viewerTimesCookieKey,
    //                 this.timesService.getToken(requestHostname, times),
    //                 {
    //                     maxAge: this.viewerTimesCookieTtl,
    //                     httpOnly: true
    //                 }
    //             )
    //             resJson.result = times
    //             resJson.code = 0
    //         }
    //     } catch (error) {
    //         resJson.code = 500
    //         resJson.errMsg = error.message
    //     }

    //     res.json(resJson).end()
    // }
}