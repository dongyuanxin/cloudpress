import { Injectable, Scope } from '@nestjs/common';
import { asyncLocalStorage } from './../utils/';
import * as pLimit from 'p-limit'

interface AsyncLimitSchema {
    readonly limitSize: number
    readonly pLimit: pLimit.Limit
}

@Injectable({
    scope: Scope.TRANSIENT
})
export class AsyncLimitService {
    private readonly cache: Record<string, AsyncLimitSchema>
    constructor() {
        this.cache = {}
    }

    public init(key: string, limitSize?: number): AsyncLimitSchema {
        if (key in this.cache) {
            return this.cache[key]
        }
        limitSize = limitSize || 10
        this.cache[key] = {
            limitSize,
            pLimit: pLimit(limitSize)
        }
    }

    public get(key: string): AsyncLimitSchema {
        if (key in this.cache) {
            return this.cache[key]
        }
        throw new Error("Please init limit controler for this key " + key)
    }
}