import axios from "axios";

const baseUrl = '//127.0.0.1'

export class PassageReq {
    static async describePassageTree() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "get",
            url: `${baseUrl}/passage/describe-passage-tree`,
        };

        const axiosRes = await axios(config);
        return axiosRes.data.result;
    }
}
