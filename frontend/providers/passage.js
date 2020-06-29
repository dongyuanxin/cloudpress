import { getApp } from './../helpers/tcb'
import { getBucketUrl } from './utils'
import moment from 'moment'

/**
 * 统计文章总数
 * @return {Promise<number>} 
 */
export async function countPassages() {
    const app = await getApp();
    const collection = app.database().collection("v1-passages");

    const { total } = await collection
        .where({})
        .count()
    
    return total
}

/**
 * 分页获取文章数据
 * @param {number} limit 
 * @param {number} page 
 * @return {Promise<any[]>}
 */
export async function describePassages(
    limit = 10,
    page = 1
) {
    const app = await getApp();
    const collection = app.database().collection("v1-passages");

    const { data } = await collection
        .where({})
        .orderBy('publishTime', 'desc')
        .skip((page - 1) * limit)
        .limit(limit)
        .get();

    return data.map((item) => ({
        ...item,
        cover: getBucketUrl(item.cover),
        publishTime: moment(item.publishTime).format('YYYY/MM/DD')
    }))
}