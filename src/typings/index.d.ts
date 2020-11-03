// 异步上下文结构体
interface ICls {
    requestId: string;
    requestTime: number;
    requestPath: string;
    requestMethod: string;
    requestHostname: string;
}

// 返回结构体
interface IResponse {
    code: number;
    requestId: string;
    result?: any;
    errMsg?: string;
}
