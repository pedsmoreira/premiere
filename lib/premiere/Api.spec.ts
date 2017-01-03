import Api from './Api';

class ApiChild extends Api {
}

describe('Api', () => {
    let api: ApiChild;

    beforeEach(() => {
        api = new ApiChild();
    });

    it('should assign properties on construct', () => {
        let cacheless = new Api({usePromiseCache: false});
        expect(Api.usePromiseCache).toBeTruthy();
        expect(cacheless.usePromiseCache).toBeFalsy();
    });

    it('should resolve instance base', () => {
        api.base = 'instance base';
        expect(api.resolveBase()).toBe('instance base');
    });

    it('should return empty path by default', () => {
        expect(api.path()).toBe('');
    });

    it('should resolve class static base', () => {
        ApiChild.base = 'child';
        expect(api.resolveBase()).toBe('child');
    });

    it('should resolve Api static base', () => {
        Api.base = 'api';
        ApiChild.base = null;
        expect(api.resolveBase()).toBe('api');
    });

    it('should resolve instance headers', () => {
        api.headers = 'headers' as any;
        expect(api.resolveHeaders()).toBe('headers');
    });

    it('should resolve class static headers', () => {
        ApiChild.headers = 'child' as any;
        expect(api.resolveHeaders()).toBe('child');
    });

    it('should resolve Api static headers', () => {
        Api.headers = 'api' as any;
        ApiChild.headers = null;
        expect(api.resolveHeaders()).toBe('api');
    });

    it('should get base url', () => {
        api.resolveBase = () => 'base';
        api.path = () => 'path';
        expect(api.baseUrl()).toBe('base/path/');
    });

    it('should not be using cache', () => {
        api.useCache = false;
        ApiChild.useCache = false;
        Api.useCache = false;
        expect(api.isUsingCache()).toBeFalsy();
    });

    it('should be using instance cache', () => {
        api.useCache = true;
        ApiChild.useCache = false;
        Api.useCache = false;
        expect(api.isUsingCache()).toBeTruthy();
    });

    it('should be using class static cache', () => {
        api.useCache = false;
        ApiChild.useCache = true;
        Api.useCache = false;
        expect(api.isUsingCache()).toBeTruthy();
    });

    it('should be using Api static cache', () => {
        api.useCache = false;
        ApiChild.useCache = false;
        Api.useCache = true;
        expect(api.isUsingCache()).toBeTruthy();
    });

    it('should not be using promise cache', () => {
        api.usePromiseCache = false;
        ApiChild.usePromiseCache = false;
        Api.usePromiseCache = false;
        expect(api.isUsingPromiseCache()).toBeFalsy();
    });

    it('should be using promise instance cache', () => {
        api.usePromiseCache = true;
        ApiChild.usePromiseCache = false;
        Api.usePromiseCache = false;
        expect(api.isUsingPromiseCache()).toBeTruthy();
    });

    it('should be using class static promise cache', () => {
        api.usePromiseCache = false;
        ApiChild.usePromiseCache = true;
        Api.usePromiseCache = false;
        expect(api.isUsingPromiseCache()).toBeTruthy();
    });

    it('should be using Api static promise cache', () => {
        api.usePromiseCache = false;
        ApiChild.usePromiseCache = false;
        Api.usePromiseCache = true;
        expect(api.isUsingPromiseCache()).toBeTruthy();
    });

    it('should get http instance with baseUrl and headers', () => {
        api.baseUrl = () => 'baseUrl';
        api.resolveHeaders = () => ({'customHeader': 'value'});

        let http = api.http();

        expect(http.defaults.headers['customHeader']).toBe('value');
        expect(http.defaults.baseURL).toBe(api.baseUrl());
    });

    it('should not check cache with usePromiseCache set to false', () => {
        api.isUsingPromiseCache = () => false;

        let promise = 'cached' as any;
        api.cache.setPromise('promise', promise);

        expect(api.cachePromise('promise', jest.fn())).not.toBe(promise);
    });

    it('should get cached promise', () => {
        api.cache.setPromise('promise', 'cached' as any);
        expect(api.cachePromise('promise', jest.fn())).toBe('cached');
    });

    it('should create new promise and add to cache', () => {
        let promise = api.cachePromise('promise', jest.fn());
        expect(api.cachePromise('promise', jest.fn)).toBe(promise);
    });

    it('should set jwt token statically', () => {
        Api.headers = {};
        Api.setJwtToken('jwt');
        expect(Api.headers['Authorization']).toBe('Bearer jwt');
    });

    it('should set jwt token', () => {
        api.headers = {};
        api.setJwtToken('jwt');
        expect(api.headers['Authorization']).toBe('Bearer jwt');
    });

    it('should remove jwt token statically', () => {
        Api.headers = {};
        Api.setJwtToken('jwt');
        Api.removeJwtToken();
        expect(Api.headers['Authorization']).toBeUndefined();
    });

    it('should remove jwt token', () => {
        api.headers = {};
        api.setJwtToken('jwt');
        api.removeJwtToken();
        expect(api.headers['Authorization']).toBeUndefined();
    });

    it('should set csrf token statically', () => {
        Api.headers = {};
        Api.setCsrfToken('csrf');
        expect(Api.headers['X-CSRF-Token']).toBe('csrf');
    });

    it('should set csrf token', () => {
        api.headers = {};
        api.setCsrfToken('csrf');
        expect(api.headers['X-CSRF-Token']).toBe('csrf');
    });

    it('should remove csrf token statically', () => {
        Api.headers = {};
        Api.setCsrfToken('csrf');
        Api.removeCsrfToken();
        expect(Api.headers['X-CSRF-Token']).toBeUndefined();
    });

    it('should remove csrf token', () => {
        api.headers = {};
        api.setCsrfToken('csrf');
        api.removeCsrfToken();
        expect(api.headers['X-CSRF-Token']).toBeUndefined();
    });
});
