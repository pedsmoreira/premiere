import Store from '../Store';
import Helper from './Helper';

describe('Store get method', () => {
    let store: Store<any>;
    let instance: any = {key: () => 1};

    beforeEach(() => {
        store = new Store<any>(null);
        store.make = jest.fn().mockReturnValue(instance);
        store.http = Helper.http('data');
    });

    it('should verify access', () => {
        store.denies = ['get'];
        expect(() => store.get(1)).toThrowError();
    });

    it('should skip access verification', () => {
        store.denies = ['get'];
        expect(() => store.get(1, {permit: true})).not.toThrow();
    });

    it('should fetch from http request', () => {
        store.get(1);
        expect(store.http().get).toHaveBeenCalledWith('1');
    });

    it('should return cached promise', () => {
        store.cache.setPromise('get/1', 'promise' as any);
        expect(store.get(1)).toBe('promise');
    });

    it('should fetch from cache', () => {
        store.cache.set(instance);
        store.get(1).then((result) => expect(result).toBe(instance));
        expect(store.http().get).not.toHaveBeenCalled();
    });

    it('should ignore cache', () => {
        store.cache.set(instance);
        store.get(1, {ignoreCache: true});
        expect(store.http().get).toHaveBeenCalledWith('1');
    });

    it('should fetch with custom url', () => {
        store.get(1, {url: 'customUrl'});
        expect(store.http().get).toHaveBeenCalledWith('customUrl');
    });

    it('should convert result to model instance', () => {
        store.get(1);
        expect(store.make).toHaveBeenCalledWith('data');
    });

    it('should add to cache', () => {
        store.get(1);
        expect(store.cache.get('1')).toBeTruthy();
    });

    it('should resolve model instance', () => {
        store.get(1).then((result: any) => {
            expect(result).toBe(instance);
        });
    });
});
