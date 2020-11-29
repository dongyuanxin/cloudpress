export interface NoticeSchema {
    noticeTitle: string;
    noticeContent: string;
    noticeTime: typeof Date;
    noticeExpiration?: number;
}

export interface DescribeNoticesReturn {
    notices: NoticeSchema[];
    count: number;
}
