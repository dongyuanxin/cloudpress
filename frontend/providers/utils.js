/**
 * 获取云存储的访问链接
 * @param {String} url 云存储的特定url
 */
export function getBucketUrl(url) {
    if (typeof url !== 'string' || !url.startsWith("cloud://")) {
        return url;
    }

    const re = /cloud:\/\/.*?\.(.*?)\/(.*)/;
    const result = re.exec(url);
    return `https://${result[1]}.tcb.qcloud.la/${result[2]}`;
}
