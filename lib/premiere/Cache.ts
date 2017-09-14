import Api from './Api';
import {Promise} from 'axios';
import {IModel} from './Model';
import Hash from './Hash';

/**
 * The cache is responsible for storing objects, lists and promises
 * The goal is to optimize the application speed and network usage
 */
export default class Cache {
    /**
     * The Api associated with the cache.
     */
    api: Api;

    /**
     * The list of objects cached.
     */
    objects: Hash<IModel> = {};

    /**
     * The list of lists of object cached.
     */
    lists: Hash<IModel[]> = {};

    /**
     * The list of promises cached.
     */
    promises: Hash<Promise<any>> = {};

    constructor(api: Api) {
        this.api = api;
    }

    /**
     * Get key from value
     *
     * @return {string}
     */
    static resolveKey(value: any | IModel): string {
        if (value === null || typeof value === 'undefined') {
            throw new Error('Unable to resolve key `' + value + '`');
        }

        if (typeof value === 'object') {
            return (value as IModel).key().toString();
        }
        return value.toString();
    }

    /**
     * Check if caching is enabled
     */
    enabled(): boolean {
        return !this.api || this.api.isUsingCache();
    }

    /**
     * Check if promise caching is enabled
     */
    promiseEnabled(): boolean {
        return !this.api || this.api.isUsingPromiseCache();
    }

    /**
     * Get object
     */
    get(value: any): IModel {
        if (this.enabled()) {
            return this.objects[value.toString()];
        }
    }

    /**
     * Get object by property value
     */
    where(property: string, value: any): IModel {
        if (this.enabled()) {
            const values: IModel[] = Object.keys(this.objects).map((key) => this.objects[key]);
            return values.find((object: IModel) => {
                return (<any> object)[property] === value;
            }) as IModel;
        }
    }

    /**
     * Set object
     */
    set(value: IModel | IModel[], clearLists: boolean = true): void {
        if (Array.isArray(value)) {
            const list = value as IModel[];
            list.forEach((it: IModel) => this.set(it, clearLists));
        } else {
            const object = value as IModel;
            if (this.enabled()) {
                this.objects[object.key()] = object;
                if (clearLists) {
                    this.lists = {};
                }
            }
        }
    }

    /**
     * Remove object
     */
    destroy(value: string | IModel): void {
        const self = this.constructor as typeof Cache;
        delete this.objects[self.resolveKey(value)];
        this.lists = {};
    }

    /**
     * Get list by name
     * @return {IModel[]}
     */
    getList(name: string): IModel[] {
        if (this.enabled()) {
            return this.lists[name];
        }
    }

    /**
     * Set list by name
     */
    setList(name: string, list: IModel[]): IModel[] {
        if (this.enabled()) {
            this.lists[name] = list;
        }
        return list;
    }

    destroyList(name: string): void {
        delete this.lists[name];
    }

    /**
     * Get promise by name
     */
    getPromise(name: string): Promise<any> {
        if (this.promiseEnabled()) {
            return this.promises[name];
        }
    }

    /**
     * Set promise by name
     */
    setPromise(name: string, promise: Promise<any>): Promise<any> {
        if (this.promiseEnabled()) {
            return this.promises[name] = promise;
        }
        return promise;
    }

    /**
     * Destroy promise by name
     */
    destroyPromise(name: string): void {
        delete this.promises[name];
    }
}
