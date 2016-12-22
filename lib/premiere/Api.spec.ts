import Api from './Api';

class ApiChild extends Api {
}

describe('Api', () => {
    let api: ApiChild;

    beforeEach(() => {
        api = new ApiChild();
    });

    it('should assign properties on construct', () => {
        let cacheless = new Api({useCache: false, usePromiseCache: false});
        expect(api.usePromiseCache).toBeTruthy();
        expect(cacheless.usePromiseCache).toBeFalsy();
    });

    it('should get class static base', () => {
        ApiChild.base = 'child';
        expect(api.base()).toBe('child');
    });

    it('should fallback to Api static base', () => {
        Api.base = 'base';
        ApiChild.base = null;
        expect(api.base()).toBe('base');
    });

    it('should get class static headers', () => {
        let headers = {key: 'value'};
        ApiChild.headers = headers;
        expect(api.headers()).toBe(headers);
    });

    it('should fallback to Api static headers', () => {
        let headers = {key: 'api'};
        Api.headers = headers;
        ApiChild.headers = null;
        expect(api.headers()).toBe(headers);
    });

    it('should get http instance with baseUrl and headers', () => {
        api.baseUrl = () => 'baseUrl';
        api.headers = () => ({'customHeader': 'value'});

        let http = api.http();

        expect(http.defaults.headers['customHeader']).toBe('value');
        expect(http.defaults.baseURL).toBe(api.baseUrl());
    });

    it('should get base url', () => {
        api.base = () => 'base';
        api.path = () => 'path';
        expect(api.baseUrl()).toBe('base/path/');
    });

    it('should not check cache with usePromiseCache set to false', () => {
        api.usePromiseCache = false;

        let promise = 'cached' as any;
        api.cache.setPromise('promise', promise);

        expect(api.cachePromise('promise', jest.fn())).not.toBe(promise)
    });

    it('should get cached promise', () => {
        let promise = 'cached' as any;
        api.cache.setPromise('promise', promise);
        expect(api.cachePromise('promise', jest.fn())).toBe(promise)
    });

    it('should create new promise and add to cache', () => {
        let promise = api.cachePromise('promise', jest.fn());
        expect(api.cachePromise('promise', jest.fn)).toBe(promise);
    });

    it('should set jwt token', () => {
        Api.setJwtToken('jwt');
        expect(api.headers()['Authorization']).toBe('Bearer jwt')
    });

    it('should remove jwt token', () => {
        Api.setJwtToken('jwt');
        Api.removeJwtToken();
        expect(api.headers()['Authorization']).toBeUndefined();
    });

    it('should set csrf token', () => {
        Api.setCsrfToken('csrf');
        expect(api.headers()['X-CSRF-Token']).toBe('csrf');
    });

    it('should remove csrf token', () => {
        Api.setCsrfToken('csrf');
        Api.removeCsrfToken();
        expect(api.headers()['X-CSRF-Token']).toBeUndefined();
    });
});
