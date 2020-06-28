import cloudbase from "@cloudbase/node-sdk";

let app, auth;

/**
 * 获取 TCB 实例
 */
export async function getApp() {
    if (!app) {
        app = cloudbase.init({
            env: process.env.ENV_ID,
            secretId: process.env.TCB_SECRET_ID,
            secretKey: process.env.TCB_SECRET_KEY,
        });
    }

    return app;
}

/**
 * 获取 TCB 的 auth 对象
 */
export async function getAuth() {
    if (!auth) {
        const app = await getApp();
        auth = app.auth();
    }

    return auth;
}

/**
 * 统一云数据库抛错格式，方便排查
 * @param {string} propmt 提示信息
 * @param {string | number} errCode 错误码
 * @param {string} errMsg 错误信息
 */
export function throwDbError(propmt, errCode, errMsg) {
    let msg = propmt;
    if (errCode) {
        msg += `，错误码是：${errCode}`;
    }
    if (errMsg) {
        msg += `，错误信息是：${errMsg}`;
    }

    throw new Error(msg);
}
