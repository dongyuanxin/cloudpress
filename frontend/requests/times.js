import axios from "axios";

const baseUrl = '//127.0.0.1'

export class TimesReq {
    static async view(url) {
        const localToken = localStorage.getItem('token')
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "get",
            url: `${baseUrl}/times/view`,
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
