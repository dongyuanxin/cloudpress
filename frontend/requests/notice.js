import axios from "axios";

const baseUrl = '//127.0.0.1'

export class NoticeReq {
    static async getNotices(params) {
        const { startTime, size } = params;

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "get",
            url: `${baseUrl}/notice?startTime=${startTime}&size=${size}`,
        };

        const axiosRes = await axios(config);
        return axiosRes.data.result;
    }
}
