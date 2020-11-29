import { getApp } from "./../helpers/tcb";
import { getBucketUrl } from "../helpers/utils";
import moment from "moment";
import axios from 'axios';

const baseUrl = 'http://127.0.0.1'

export class PassageProvider {
    /**
     * 统计文章总数
     * @return {Promise<number>}
     */
    static async countPassages() {
        const config = {
            method: 'get',
            url: `${baseUrl}/passage/count-all-passages`
        }

        const axiosRes = await axios(config)
        return axiosRes.data.result;
    }

    /**
     * 分页获取文章数据
     * @param {number} limit
     * @param {number} page
     * @return {Promise<any[]>}
     */
    static async describePassages(limit = 10, page = 1) {
        const config = {
            method: 'get',
            url: `${baseUrl}/passage/describe-passages?limit=${limit}&page=${page}`
        }

        const axiosRes = await axios(config)
        return axiosRes.data.result;
    }

    /**
     * 获取对应的文章
     * @param {string} passageId
     * @return {Promise<object>}
     */
    static async describePassage(passageId) {
        const config = {
            method: 'get',
            url: `${baseUrl}/passage/describe-passage-by-id?passageId=${passageId}`
        }

        const axiosRes = await axios(config)
        return axiosRes.data.result;
    }

    /**
     * 获取文章的全部id
     * @return {Promise<string[]>}
     */
    static async describePsgIDs() {
        const config = {
            method: 'get',
            url: `${baseUrl}/passage/describe-all-passage-ids`
        }

        const axiosRes = await axios(config)
        return axiosRes.data.result;
    }
}