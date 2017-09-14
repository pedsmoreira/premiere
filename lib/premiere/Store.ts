import Api from './Api';
import Model from './Model';
import Cache from './Cache';
import Hash from './Hash';

export interface IStoreFetch {
    ignoreCache?: boolean;
    url?: string;
}

export interface IStoreSet {
    url?: string;
}

export interface IStoreForeign {
    ignoreCache?: boolean;
    url?: string;
    set?: boolean;
}

export interface IStoreAct {
    url?: string;
    data?: Hash<any>;
    method?: string;
}

/**
 * A Store is an Api that handles the requests for a given Model
 */
export default class Store<T extends Model> extends Api {
    /**
     * The model associated with the Store
     */
    model: typeof Model;

    /**
     * If true, the results from `index` will be stored in the cache as objects
     */
    setIndex: boolean;

    constructor(model: typeof Model, properties: Hash<any> = {}) {
        super(properties);
        this.model = model;

        if (model && !model.store) {
            model.store = this as any;
        }
    }

    /**
     * @inheritDoc
     */
    path(): string {
        return this.model.path;
    }

    /**
     * Get new model instance
     */
    make(values: Hash<any> | Hash<any>[], normalize: boolean = true): T | T[] {
        return this.model.make(values, normalize) as T | T[];
    }

    /**
     * Get index
     */
    index(options: IStoreFetch = {}): Promise<T[]> {
        const url = options.url || '';
        return this.cachePromise(`index/${url}`, (resolve, reject) => {
            const list = this.cache.getList(`index/${url}`);
            if (!options.ignoreCache && list) {
                if (list) {
                    return resolve(list);
                }
            }

            const promise = this.http().get(url);
            promise.then(response => {
                const list = this.make(response.data) as T[];
                this.cache.setList(`index/${url}`, list);
                if (this.setIndex) {
                    this.cache.set(list, false);
                }

                resolve(list);
            }, reject);
        });
    }

    /**
     * Make http get request
     */
    get(key: any, options: IStoreFetch = {}): Promise<T> {
        key = Cache.resolveKey(key);
        const url = options.url || key.toString();

        return this.cachePromise(`get/${url}`, (resolve, reject) => {
            if (!options.ignoreCache) {
                const object = this.cache.get(key);
                if (object) {
                    return resolve(object);
                }
            }

            const promise = this.http().get(url);
            promise.then(response => {
                const instance = this.make(response.data);
                this.cache.set(instance, false);
                resolve(instance);
            }, reject);
        });
    }

    /**
     * Make http get request to fetch by property
     */
    where(property: string, value: any, options: IStoreFetch = {}): Promise<T> {
        let url = options.url;
        if (!options.url) {
            url = `${property}/${value}`;
        }

        return this.cachePromise(`where/${url}`, (resolve, reject) => {
            if (!options.ignoreCache) {
                const object = this.cache.where(property, value);
                if (object) {
                    return resolve(object);
                }
            }

            const promise = this.http().get(url);
            promise.then(response => {
                const instance = this.make(response.data);
                this.cache.set(instance, false);
                resolve(instance);
            }, reject);
        });
    }

    /**
     * Make http post request
     */
    create(data: Hash<any>, options: IStoreSet = {}): Promise<T> {
        const promise = this.http().post(options.url || '', data);
        return new Promise((resolve, reject) => {
            promise.then((response) => {
                const instance = this.make(response.data) as T;
                this.cache.set(instance);
                resolve(instance);
            }, reject);
        });
    }

    /**
     * Make http put request
     */
    update(data: Hash<any>, options: IStoreSet = {}): Promise<T> {
        return new Promise((resolve, reject) => {
            const promise = this.http().put(options.url || data[this.model.keyColumn].toString(), data);
            promise.then((response) => {
                const instance = this.make(response.data) as T;
                this.cache.set(instance);
                resolve(instance);
            }, reject);
        });
    }

    /**
     * Make http request to destroy model
     */
    destroy(value: T | any, options: IStoreSet = {}): Promise<any> {
        const id = Cache.resolveKey(value);
        const promise = this.http().delete(options.url || id);

        promise.then(() => this.cache.destroy(id));

        return promise as Promise<any>;
    }

    /**
     * Call foreign method of store associated with given model
     */
    by(model: typeof Model, key: any, options: IStoreForeign = {}): Promise<T[]> {
        return model.resolveStore().foreign(this.model, key, options) as any;
    }

    /**
     * Make http request to fetch instances by foreign key
     */
    foreign(model: typeof Model, key: any, options: IStoreForeign = {}): Promise<T[]> {
        key = Cache.resolveKey(key);
        const url = options.url || `${key}/${model.path}`;

        return this.cachePromise(`foreign/${url}`, ((resolve, reject) => {
            const store = model.resolveStore();
            const list = store.cache.getList(url);
            if (!options.ignoreCache && list) {
                return resolve(list);
            }

            this.http().get(url).then((response: any) => {
                resolve(store.resolveForeign(response.data, Object.assign(options, {url})));
            }, reject);
        }));
    }

    /**
     * Resolve result from foreign method
     */
    protected resolveForeign(data: Hash<any> | Hash<any>[], options: IStoreForeign): T[] {
        if (!Array.isArray(data)) {
            data = [data];
        }

        const result = this.make(data) as T[];

        this.cache.setList(options.url, result as T[]);
        if (options.set) {
            this.cache.set(result, false);
        }

        return result;
    }

    /**
     * Make http to act
     */
    act(key: any, action: string, options: IStoreAct = {}): Promise<any> {
        key = Cache.resolveKey(key);

        const url = options.url || `${key}/${action}`;
        const method = (<any> this.http())[options.method || 'put'];
        return method(url, options.data);
    }
}
