import { AsyncLocalStorage } from 'async_hooks';
import { v4 } from 'uuid';
import * as crypto from 'crypto'

/**
 * CLS
 */
export const asyncLocalStorage = new AsyncLocalStorage<ICls>();

/**
 * uuid version4
 */
export const uuidV4 = v4;

/**
 * sha256 with hmac
 */
export const sha256 = (data: string, secret = ''): string => {
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(data)
    return hmac.digest("hex")
}
