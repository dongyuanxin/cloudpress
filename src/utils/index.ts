import { AsyncLocalStorage } from 'async_hooks';
import { v4 } from 'uuid';

/**
 * CLS
 */
export const asyncLocalStorage = new AsyncLocalStorage<ICls>();

/**
 * uuid version4
 */
export const uuidV4 = v4;
