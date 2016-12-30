import Store from '../Store';
import Helper from './Helper';

describe('Store where method', () => {
    let store: Store<any>;
    let instance: any = {key: () => 'id', property: 'value'};

    beforeEach(() => {
        store = new Store<any>(null);
        store.make = jest.fn().mockReturnValue(instance);
        store.http = Helper.http('data');
    });

    it('should verify access', () => {
        store.denies = ['where'];
        expect(() => store.where('property', 'value')).toThrowError();
    });

    it('should skip access verification', () => {
        store.denies = ['where'];
        expect(() => store.where('property', 'value', {permit: true})).not.toThrow();
    });

    it('should fetch from http request', () => {
        store.where('property', 'value');
        expect(store.http().get).toHaveBeenCalledWith('property/value');
    });

    it('should return cached promise', () => {
        store.cache.setPromise('where/property/value', 'promise' as any);
        expect(store.where('property', 'value')).toBe('promise');
    });

    it('should fetch from cache', () => {
        store.cache.set(instance);
        store.where('property', 'value').then((result) => expect(result).toBe(instance));
        expect(store.http().get).not.toHaveBeenCalled();
    });

    it('should ignore cache', () => {
        store.cache.set(instance);
        store.where('property', 'value', {ignoreCache: true});
        expect(store.http().get).toHaveBeenCalledWith('property/value');
    });

    it('should fetch with custom url', () => {
        store.where('property', 'value', {url: 'customUrl'});
        expect(store.http().get).toHaveBeenCalledWith('customUrl');
    });

    it('should convert result to model instance', () => {
        store.where('property', 'value');
        expect(store.make).toHaveBeenCalledWith('data');
    });

    it('should add to cache', () => {
        store.where('property', 'value');
        expect(store.cache.where('property', 'value')).toBeTruthy();
    });

    it('should resolve model instance', () => {
        store.where('property', 'value').then((result: any) => {
            expect(result).toBe(instance);
        });
    });
});
