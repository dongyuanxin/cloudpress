import axios from "axios";
import { BASE_REQUEST_URL } from './../config';

export class SearchReq {
    static async searchPassages(params) {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "post",
            url: `${BASE_REQUEST_URL}/search/passages`,
            data: params,
        };

        const axiosRes = await axios(config);
        return axiosRes.data.result;
    }
}
