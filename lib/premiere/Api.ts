import Cache from './Cache';
import Hash from './Hash';
import axios, {AxiosInstance} from 'axios';

/**
 * An Api instance defines the properties to consume a restful api
 */
export default class Api {
    /**
     * Default base path
     */
    static base: string;

    /**
     * The base path to your Api
     * Eg.: http://my-api.com
     */
    base: string;

    /**
     * Default headers
     */
    static headers: Hash<string> = {};

    /**
     * Api headers. You can use it for Authentication for example.
     */
    headers: Hash<string>;

    /**
     * Default use cache value
     */
    static useCache: boolean = true;

    /**
     * Sets whether or not caching is enabled
     */
    useCache: boolean;

    /**
     * Default use promise cache value
     */
    static usePromiseCache = true;

    /**
     * If set to true, the promises to fetch data will be cached,
     * so if you do the same request twice, before the results come back, the response will be the same Promise.
     */
    usePromiseCache: boolean;

    /**
     * Cache instance attached to the Api
     */
    cache: Cache = new Cache(this);

    constructor(properties: Hash<any> = {}) {
        Object.assign(this, properties);
    }

    /**
     * Get path.
     * This is very useful if you have one Api for each model for example
     * Eg. books (base + path would look like http://my-api.com/books)
     * @type {string}
     */
    path(): string {
        return '';
    }

    /**
     * Get api base
     * @return {string}
     */
    resolveBase(): string {
        let self = this.constructor as typeof Api;
        return this.base || self.base || Api.base;
    }

    /**
     * Get api headers
     * @return {Hash<string>}
     */
    resolveHeaders(): Hash<string> {
        let self = this.constructor as typeof Api;
        return this.headers || self.headers || Api.headers;
    }

    /**
     * Get base url (base + path)
     * @returns {string}
     */
    baseUrl(): string {
        let base = this.resolveBase();
        if (!base.endsWith('/')) {
            base += '/';
        }

        let path = this.path();
        if (!path.endsWith('/')) {
            path += '/';
        }

        return base + path;
    }

    /**
     * Check if instance is using cache
     */
    isUsingCache(): boolean {
        return this.useCache || (this.constructor as typeof Api).useCache || Api.useCache;
    }

    /**
     * Check if instance is using promise cache
     */
    isUsingPromiseCache(): boolean {
        return this.usePromiseCache || (this.constructor as typeof Api).usePromiseCache || Api.usePromiseCache;
    }

    /**
     * Get http requester
     * @return {AxiosInstance}
     */
    http(): AxiosInstance {
        return axios.create({
            baseURL: this.baseUrl(),
            headers: this.resolveHeaders()
        });
    }

    /**
     * Cache promise by name, so it doesn't get executed again before the result comes back
     */
    cachePromise(name: string, fn: (resolve: (value?: any) => void, reject: (reason?: any) => void) => void): Promise<any> {
        if (!this.isUsingPromiseCache()) {
            return new Promise(fn);
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
     * Add JWT authorization header for a given token
     */
    static setJwtToken(token: string, target: Hash<any> = this.headers): void {
        target['Authorization'] = `Bearer ${token}`;
    }

    /**
     * Add JWT authorization header for a given token
     */
    setJwtToken(token: string): void {
        let self = this.constructor as typeof Api;
        self.setJwtToken(token, this.headers);
    }

    /**
     * Remove JWT authorization header
     */
    static removeJwtToken(target: Hash<any> = this.headers): void {
        delete target['Authorization'];
    }

    /**
     * Remove JWT authorization header
     */
    removeJwtToken(): void {
        let self = this.constructor as typeof Api;
        self.removeJwtToken(this.headers);
    }

    /**
     * Add CSRF token to static header
     */
    static setCsrfToken(token: string, target: Hash<any> = this.headers): void {
        target['X-CSRF-Token'] = token;
    }

    setCsrfToken(token: string): void {
        let self = this.constructor as typeof Api;
        self.setCsrfToken(token, this.headers);
    }

    /**
     * Remove CSRF token from static header
     */
    static removeCsrfToken(target: Hash<any> = this.headers): void {
        delete target['X-CSRF-Token'];
    }

    /**
     * Remove CSRF token from header
     */
    removeCsrfToken(): void {
        let self = this.constructor as typeof Api;
        self.removeCsrfToken(this.headers);
    }
}
