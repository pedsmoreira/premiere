import StoreCache from './StoreCache';
import Model from './Model';
import PromiseCascade, {PromiseFunction} from 'promise-cascade';

export interface StoreCascadeOptions {
    ignoreCache?: boolean;
}

export interface StoreCascadeListOptions extends StoreCascadeOptions {
    completeItems?: boolean;
}

export default class StoreCacheCascade<T extends Model> extends PromiseCascade {
    cache: StoreCache<T>;

    constructor(cache: StoreCache<T>) {
        super();
        this.cache = cache;
    }

    protected promiseCallback(key: string, callback: PromiseFunction): Promise<T | T[]> {
        const cached = this.cache.promises.get(key);
        if (cached) {
            return cached;
        }

        return this.cache.promises.set(key, callback());
    }

    promise(key: string): this {
        return this.push(this.promiseCallback.bind(this), key);
    }

    protected async objectCallback(key: any, options: StoreCascadeOptions, callback: PromiseFunction): Promise<T> {
        const cached = this.cache.objects.get(key);
        if (!options.ignoreCache && cached) {
            return cached;
        }

        const result: T = await callback();
        return this.cache.objects.set(result.key, result);
    }

    object(key: any, options: StoreCascadeOptions): this {
        return this.push(this.objectCallback.bind(this), key, options);
    }

    protected async listCallback(key: string, options: StoreCascadeListOptions, callback: PromiseFunction): Promise<T[]> {
        if (!options.ignoreCache) {
            const cached = this.cache.lists.get(key);
            if (cached) {
                return cached;
            }
        }

        const list: T[] = await callback();
        if (options.completeItems) {
            list.forEach((object) => this.cache.objects.set(object.key, object));

        }

        return this.cache.lists.set(key, list);
    }

    list(key: string, options?: StoreCascadeListOptions): this {
        return this.push(this.listCallback.bind(this), key, options);
    }
}
