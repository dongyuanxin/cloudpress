import { AsyncLocalStorage } from 'async_hooks';

/**
 * CLS
 */
export const asyncLocalStorage = new AsyncLocalStorage<ICls>();