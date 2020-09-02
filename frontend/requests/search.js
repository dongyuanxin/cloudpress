import axios from "axios";

export class SearchReq {
    static async searchPassages(params) {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "post",
            url: `//service.xxoo521.com/apis/search/passages`,
            data: params,
        };

        const axiosRes = await axios(config);
        return axiosRes.data.result;
    }
}
