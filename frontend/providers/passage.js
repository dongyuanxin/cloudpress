import { getApp } from "./../helpers/tcb";
import { getBucketUrl } from "./utils";
import moment from "moment";

/**
 * 统计文章总数
 * @return {Promise<number>}
 */
export async function countPassages() {
    const app = await getApp();
    const collection = app.database().collection("v1-passages");

    const { total } = await collection.where({}).count();

    return total;
}

/**
 * 分页获取文章数据
 * @param {number} limit
 * @param {number} page
 * @return {Promise<any[]>}
 */
export async function describePassages(limit = 10, page = 1) {
    const app = await getApp();
    const collection = app.database().collection("v1-passages");

    const { data } = await collection
        .where({})
        .orderBy("publishTime", "desc")
        .skip((page - 1) * limit)
        .limit(limit)
        .get();

    return data.map((item) => ({
        ...item,
        cover: getBucketUrl(item.cover) || "",
        publishTime: moment(item.publishTime).format("YYYY.MM.DD"),
    }));
}

/**
 * 获取对应的文章
 * @param {string} psgID
 * @return {Promise<object>}
 */
export async function describePassage(psgID) {
    const app = await getApp();
    const collection = app.database().collection("v1-passages");

    const { data } = await collection
        .where({
            psgID,
        })
        .get();

    return {
        ...data[0],
        cover: getBucketUrl(data[0].cover) || "",
        publishTime: moment(data[0].publishTime).format("YYYY.MM.DD"),
    };
}

/**
 * 获取文章的全部id
 * @return {Promise<string>}
 */
export async function describePsgIDs() {
    const app = await getApp();
    const collection = app.database().collection("v1-passages");

    const total = await countPassages();
    const step = 100;
    // 查询数量上限为100，要分批查询
    const promises = [];
    for (let i = 0; i <= Math.floor(total / step); ++i) {
        promises.push(
            collection
                .where({})
                .field({ psgID: true })
                .orderBy("publishTime", "desc")
                .skip(i * step)
                .limit(step)
                .get()
        );
    }

    const results = await Promise.all(promises);
    const psgIDs = [];
    for (const { data } of results) {
        for (const { psgID } of data) {
            psgIDs.push(psgID);
        }
    }

    return psgIDs;
}
