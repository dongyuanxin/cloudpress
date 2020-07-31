/**
 * 获取云存储的访问链接
 * @param {string} url 云存储的特定url
 */
export function getBucketUrl(url) {
    if (typeof url !== "string" || !url.startsWith("cloud://")) {
        return url;
    }

    const re = /cloud:\/\/.*?\.(.*?)\/(.*)/;
    const result = re.exec(url);
    return `https://${result[1]}.tcb.qcloud.la/${result[2]}`;
}

/**
 * 将 ISO 时间串格式化为 YYYY.MM.DD HH:mm 的格式
 * @param {string} str ISO 格式时间串
 */
export function formatISOString(str) {
    const addZeroPre = (number) => (number < 10 ? `0${number}` : `${number}`);

    const date = new Date(str);
    const [year, month, day, hour, minute] = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
    ].map(addZeroPre);

    return `${year}.${month}.${day} ${hour}:${minute}`;
}
