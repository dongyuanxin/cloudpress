import axios from "axios";

export class NoticeReq {
    static async getNotices(params) {
        const { startTime, size } = params;

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "get",
            url: `//env-nxwksyfx.service.tcloudbase.com/service/notice?startTime=${startTime}&size=${size}`,
        };

        const axiosRes = await axios(config);
        return axiosRes.data.result;
    }
}
