import Store from '../Store';
import Helper from './Helper';

describe('Store foreign method', () => {
    let store: Store<any>;
    let model: any = {path: 'path'};
    let data: any = [{id: 1}];
    let instances: any = [{key: () => data[0].id}];

    beforeEach(() => {
        store = new Store<any>(null);
        store.normalizedModel = jest.fn().mockReturnValue(instances);
        store.http = Helper.http(data);
    });

    it('should verify access', () => {
        store.denies = ['foreign'];
        expect(() => store.foreign(1, model)).toThrowError();
    });

    it('should skip access verification', () => {
        store.denies = ['foreign'];
        expect(() => store.foreign(1, model, {permit: true})).not.toThrow();
    });

    it('should fetch from http request', () => {
        store.foreign(1, model);
        expect(store.http().get).toHaveBeenCalledWith('1/path');
    });

    it('should return cached promise', () => {
        store.cache.setPromise('foreign/1/path', 'promise' as any);
        expect(store.foreign(1, model)).toBe('promise');
    });

    it('should fetch from cache', () => {
        store.cache.setList('1/path', instances);
        store.foreign(1, model).then((result) => expect(result).toBe(instances));
        expect(store.http().get).not.toHaveBeenCalled();
    });

    it('should ignore cache', () => {
        store.cache.setList('foreign', instances);
        store.foreign(1, model, {ignoreCache: true});
        expect(store.http().get).toHaveBeenCalledWith('1/path');
    });

    it('should fetch with custom url', () => {
        store.foreign(1, model, {url: 'customUrl'});
        expect(store.http().get).toHaveBeenCalledWith('customUrl');
    });

    it('should convert result to list of model instances', () => {
        store.foreign(1, model);
        expect(store.normalizedModel).toHaveBeenCalledWith(data);
    });

    it('should add list to cache', () => {
        store.foreign(1, model);
        expect(store.cache.getList('1/path')).toBeTruthy();
    });

    it('should add model to cache', () => {
        store.cache.set = jest.fn();
        store.foreign(1, model, {set: true});
        expect(store.cache.set).toHaveBeenCalledWith(instances, false);
    });

    it('should not add model to cache', () => {
        store.cache.set = jest.fn();
        store.foreign(1, model);
        expect(store.cache.set).not.toHaveBeenCalled();
    });

    it('should resolve model instances', () => {
        store.foreign(1, model).then((result: any) => {
            expect(result).toBe(instances);
        });
    });
});
