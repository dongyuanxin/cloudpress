import * as crypto from 'crypto';

const cache = new Map();
const cacheWrapper = (func) => {
    if (typeof func !== "function") {
        throw new Error("Param error: func must be function");
    }

    return async function () {
        if (!cache.has(func)) {
            cache.set(func, new Map());
        }

        const paramsStr = JSON.stringify([...arguments]);
        const sha256 = crypto.createHash("sha256");
        sha256.update(paramsStr);
        const key = sha256.digest("hex");

        const funcMap = cache.get(func);
        if (funcMap.has(key)) {
            return funcMap.get(key);
        }

        const res = await func(...arguments);
        funcMap.set(key, res);
        return res;
    };
};

export { cacheWrapper };
