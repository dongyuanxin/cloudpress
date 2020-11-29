import axios from "axios";

const baseUrl = '//127.0.0.1'

export class SearchReq {
    static async searchPassages(params) {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "post",
            url: `${baseUrl}/search/passages`,
            data: params,
        };

        const axiosRes = await axios(config);
        return axiosRes.data.result;
    }
}
