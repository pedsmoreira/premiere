import Api from './Api';
import Model from './Model';
import Cache from './Cache';

export interface IStoreFetch {
    ignoreCache?: boolean;
    url?: string;
}

export interface IStoreSet {
    url?: string;
}

export interface IStoreBy {
    ignoreCache?: boolean;
    url?: string;
    set?: boolean;
}

export interface IStoreAct {
    url?: string;
    data?: {[_: string]: any};
    method?: string;
}

/**
 * A Store is an Api that handles the requests for a given Model
 */
export default class Store<T> extends Api {
    /**
     * The model associated with the Store
     */
    model: typeof Model;

    /**
     * The default methods allowed by the store
     * If none given, all will be allowed
     */
    allows: String[];
    /**
     * The default methods denied by the store
     * If none given, all will be allowed
     */
    denies: String[];

    /**
     * If true, the results from `index` will be stored in the cache as objects
     */
    setIndex: boolean;

    constructor(model: typeof Model, properties: {[_: string]: any} = {}) {
        super(properties);
        this.model = model;
    }

    /**
     * @inheritDoc
     */
    path(): string {
        return this.model.path;
    }

    /**
     * Check if method is allowed
     */
    isMethodAllowed(method: string): boolean {
        if (this.denies && this.denies.indexOf(method) !== -1) {
            return false;
        }
        return !this.allows || this.allows.indexOf(method) !== -1;
    }

    /**
     * Verify if a method can be executed. If it can't, throw an error
     * @throws Error
     */
    verifyPermission(method: string): void {
        if (!this.isMethodAllowed(method)) {
            let message = `Method '${method}' is not allowed in '${this.model.path}' store`;
            throw new Error(message);
        }
    }

    /**
     * Shortcut for verifying method permission and caching promise
     */
    verifyAndCache(name: string, fn: (resolve: (value?: any) => void, reject: (reason?: any) => void) => void): Promise<any> {
        this.verifyPermission(name.split('/')[0]);
        return this.cachePromise(name, fn);
    }

    /**
     * Get new model instance
     */
    modelInstance(values: {[_: string]: string}): Model | Model[] {
        return this.model.make(values);
    }

    /**
     * Get new normalized model instance
     */
    normalizedModel(values: {[_: string]: string}): Model | Model[] {
        if (Array.isArray(values)) {
            return values.map(object => this.normalizedModel(object)) as Model[];
        }

        let instance = this.modelInstance(values) as Model;
        instance.normalize();

        return instance;
    }

    /**
     * Get index
     */
    index(options: IStoreFetch = {}): Promise<T[]> {
        return this.verifyAndCache('index', (resolve, reject) => {
            let list = this.cache.getList('index');
            if (!options.ignoreCache && list) {
                if (list) {
                    return resolve(list);
                }
            }

            let promise = this.http().get(options.url || '');
            promise.then(response => {
                let list = this.normalizedModel(response.data) as Model[];
                this.cache.setList('index', list);
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
    get(key: string, options: IStoreFetch = {}): Promise<T> {
        key = Cache.resolveKey(key);

        return this.verifyAndCache(`get/${key}`, (resolve, reject) => {
            if (!options.ignoreCache) {
                let object = this.cache.get(key);
                if (object) {
                    return resolve(object);
                }
            }

            let promise = this.http().get(options.url || key.toString());
            promise.then(response => {
                let instance = this.normalizedModel(response.data);
                resolve(this.cache.set(instance, false));
            }, reject);
        });
    }

    /**
     * Make http get request to fetch by property
     */
    where(property: string, value: any, options: IStoreFetch): Promise<T | T[]> {
        return this.verifyAndCache(`where/${property}/${value}`, (resolve, reject) => {
            if (!options.ignoreCache) {
                let object = this.cache.where(property, value);
                if (object) {
                    return resolve(object);
                }
            }

            let url = options.url;
            if (!options.url) {
                let name = property.split('_').map((str) => str.substring(0, 1).toUpperCase() + str.substring(1));
                url = `by${name}`;
            }

            let promise = this.http().get(url);
            promise.then(response => {
                let instance = this.normalizedModel(response.data);
                resolve(this.cache.set(instance, false));
            }, reject);
        });
    }

    /**
     * Make http post request
     */
    create(data: {[_: string]: any}, options: IStoreSet = {}): Promise<T> {
        this.verifyPermission('create');

        let promise = this.http().post(options.url || '', data);
        return new Promise((resolve, reject) => {
            promise.then((response) => {
                let instance = this.normalizedModel(response.data);
                resolve(this.cache.set(instance));
            }, reject);
        });
    }

    /**
     * Make http put request
     */
    update(data: {[_: string]: any}, options: IStoreSet): Promise<T> {
        this.verifyPermission('update');

        return new Promise((resolve, reject) => {
            let promise = this.http().put(options.url || data[this.model.keyColumn], data);
            promise.then((response) => {
                let instance = this.normalizedModel(response.data);
                resolve(this.cache.set(instance));
            }, reject);
        });
    }

    /**
     * Make http request to destroy model
     */
    destroy(value: Model | any, options: IStoreSet = {}): Promise<any> {
        this.verifyPermission('delete');

        let id = Cache.resolveKey(value);
        let promise = this.http().delete(options.url || id);

        promise.then(() => this.cache.destroy(id));

        return promise as Promise<any>;
    }

    /**
     * Make http request to fetch instances by foreign key
     */
    by(model: Model | typeof Model, value: any = undefined, options: IStoreBy = {}): Promise<T[]> {
        if (typeof model === 'object') {
            value = model.key();
            model = model.constructor as typeof Model;
        }

        let url = options.url || `${value}/${this.model.path}`;

        return this.cachePromise(`by/${url}`, ((resolve, reject) => {
            let list = this.cache.getList(url);
            if (!options.ignoreCache && list) {
                return resolve(list);
            }

            let promise = (model as typeof Model).resolveStore().http().get(url);
            promise.then((response: any) => {
                let list = this.normalizedModel(response.data) as Model[];
                this.cache.setList(url, list);

                if (options.set || (!Array.isArray(list) && options.set !== false)) {
                    this.cache.set(list, false);
                }

                resolve(list);
            }, reject);
        }));
    }

    /**
     * Make http to act
     */
    act(key: any, action: string, options: IStoreAct = {}): Promise<any> {
        if (!options.url) {
            options.url = `${key}/${action}`;
        }

        return (<any> this.http())[options.method || 'put'](options.url, options.data);
    }
}
