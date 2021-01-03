import axios from "axios";
import { BASE_REQUEST_URL } from './../config';

export class TimesReq {
    static async view(url) {
        const localToken = localStorage.getItem('token')
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "get",
            url: `${BASE_REQUEST_URL}/times/view`,
            headers: {
                'x-cloudpress-url': url || '/',
                'x-cloudpress-token': localToken
            }
        };

        const axiosRes = await axios(config);
        const { token } = axiosRes.data.result || {}
        if (token !== localToken) {
            localStorage.setItem('token', token)
        }
        return axiosRes.data.result;
    }
}
