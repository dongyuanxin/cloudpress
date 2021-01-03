import axios from "axios";
import { BASE_REQUEST_URL } from './../config'

export class PassageReq {
    static async describePassageTree() {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "get",
            url: `${BASE_REQUEST_URL}/passage/describe-passage-tree`,
        };

        const axiosRes = await axios(config);
        return axiosRes.data.result;
    }
}
