import Cache from './Cache';
import axios from 'axios';
import {AxiosInstance} from 'axios';

/**
 * An Api instance defines the properties to consume a restful api
 */
export default class Api {
    /**
     * The base path to your Api
     * Eg.: http://my-api.com
     */
    static base: string = '';

    /**
     * Api headers. You can use it for Authentication for example.
     */
    static headers: {[_: string]: string} = {};

    /**
     * Sets whether or not caching is enabled
     */
    useCache: boolean = true;

    /**
     * If set to true, the promises to fetch data will be cached,
     * so if you do the same request twice, before the results come back, the response will be the same Promise.
     */
    usePromiseCache: boolean = true;

    /**
     * Cache instance attached to the Api
     */
    cache: Cache = new Cache(this);

    constructor(properties: {[_: string]: any} = {}) {
        Object.assign(this, properties)
    }

    /**
     * Get base path.
     * Eg.: http://my-api.com
     * @return {string}
     */
    base(): string {
        let self = this.constructor as typeof Api;
        return self.base || Api.base
    }

    /**{
     * Get path.
     * This is very useful if you have one Api for each model for example
     * Eg. books (base + path would look like http://my-api.com/books)
     * @type {string}
     */
    path(): string {
        return ''
    }

    /**
     * Get request headers
     * @return {Object}
     */
    headers(): {[_: string]: string} {
        let self = this.constructor as typeof Api;
        return self.headers || Api.headers
    }

    /**
     * Get http requester
     * @return {AxiosInstance}
     */
    http(): AxiosInstance {
        return axios.create({
            baseURL: this.baseUrl(),
            headers: this.headers()
        });
    }

    /**
     * Get base url (base + path)
     * @returns {string}
     */
    baseUrl(): string {
        let base = this.base();
        if (!base.endsWith('/')) {
            base += '/';
        }

        let path = this.path();
        if (!path.endsWith('/')) {
            path += '/';
        }

        return base + path
    }

    /**
     * Cache promise by name, so it doesn't get executed again before the result comes back
     */
    cachePromise(name: string, fn: (resolve: (value?: any) => void, reject: (reason?: any) => void) => void): Promise<any> {
        if (!this.usePromiseCache) {
            return new Promise(fn)
        }

        let cached = this.cache.getPromise(name);
        if (cached) {
            return cached as Promise<any>;
        }

        let promise = new Promise(fn);
        this.cache.setPromise(name, promise);

        let destroyCallback = () => {
            this.cache.destroyPromise(name);
        };
        promise.then(destroyCallback, destroyCallback);

        return promise;
    }

    /**
     * Add Jwt authorization header for a given token
     */
    static setJwtToken(token: string): void {
        this.headers['Authorization'] = `Bearer ${token}`;
    }

    /**
     * Remove Jwt authorization header
     */
    static removeJwtToken(): void {
        delete this.headers['Authorization'];
    }

    /**
     * Add CSRF token to header
     * @param token
     */
    static setCsrfToken(token: string): void {
        this.headers['X-CSRF-Token'] = token;
    }

    /**
     * Remove CSRF token from header
     */
    static removeCsrfToken(): void {
        delete this.headers['X-CSRF-Token'];
    }
}
