import axios from "axios";
import { BASE_REQUEST_URL } from './../config'

export class NoticeReq {
    static async getNotices(params) {
        const { startTime, size } = params;

        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "get",
            url: `${BASE_REQUEST_URL}/notice?startTime=${startTime}&size=${size}`,
        };

        const axiosRes = await axios(config);
        return axiosRes.data.result;
    }
}
