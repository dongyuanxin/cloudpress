import { Injectable, Scope } from '@nestjs/common';
import { LoggerService } from './logger.service';
import QuickLru from 'quick-lru';
import { CACHE_LOCAL_TTL, CAHCE_LOCAL_LRU_MAX_SIZE } from './../constants';

export interface LruCache {
    value: any; // 缓存值
    expire: number; // 过期时间
}

// 针对每个中间件单独生成实例，防止开发时，缓存key设置不当导致缓存污染，难以排查问题
@Injectable({
    scope: Scope.TRANSIENT,
})
export class LocalCacheService {
    private readonly ttl: number;
    private readonly maxSize: number;
    private readonly lruCache: QuickLru<string, LruCache>;

    constructor(private readonly loggerService: LoggerService) {
        this.ttl = CACHE_LOCAL_TTL;
        this.maxSize = CAHCE_LOCAL_LRU_MAX_SIZE;
        this.lruCache = new QuickLru({ maxSize: this.maxSize });
    }

    public set(key: string, params: { value: any; ttl?: number }) {
        const ttl = params.ttl || this.ttl;
        const ts = Date.now();
        const expire = ts + ttl;

        this.lruCache.set(key, {
            expire,
            value: params.value,
        });
        this.loggerService.info({
            logType: 'LocalCacheHit',
            cacheType: 'local',
            cacheOperation: 'create',
            cacheKey: key,
            cacheValue: String(params.value),
        });
    }

    public get(key: string): any | void {
        const cacheLog = {
            logType: 'LocalCacheHit',
            cacheType: 'local',
            cacheKey: key,
        } as const;

        // 缓存不在LRU链表中
        if (!this.lruCache.has(key)) {
            this.loggerService.info({
                ...cacheLog,
                cacheOperation: 'miss',
            });
            return;
        }

        const data = this.lruCache.get(key);
        const { value, expire } = data;
        const now = new Date().getTime();
        if (now <= expire) {
            this.loggerService.info({
                ...cacheLog,
                cacheOperation: 'hit',
                cacheValue: String(value),
            });
            return value;
        }
        // 缓存过期，清除本地缓存
        this.lruCache.delete(key);
        this.loggerService.info({
            ...cacheLog,
            cacheOperation: 'del',
        });
        return;
    }
}
