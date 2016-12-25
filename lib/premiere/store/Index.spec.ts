import Store from '../Store';
import Helper from './Helper';

describe('Store index method', () => {
    let store: Store<any>;
    let data: any = [{id: 1}];
    let instances: any = [{key: () => data[0].id}];

    beforeEach(() => {
        store = new Store<any>(null);
        store.normalizedModel = jest.fn().mockReturnValue(instances);
        store.http = Helper.http(data);
    });

    it('should verify access', () => {
        store.denies = ['index'];
        expect(() => store.index()).toThrowError();
    });

    it('should skip access verification', () => {
        store.denies = ['index'];
        expect(() => store.index({permit: true})).not.toThrow();
    });

    it('should fetch from http request', () => {
        store.index();
        expect(store.http().get).toHaveBeenCalledWith('');
    });

    it('should return cached promise', () => {
        store.cache.setPromise('index', 'promise' as any);
        expect(store.index()).toBe('promise');
    });

    it('should fetch from cache', () => {
        store.cache.setList('index', instances);
        store.index().then((result) => expect(result).toBe(instances));
        expect(store.http().get).not.toHaveBeenCalled();
    });

    it('should ignore cache', () => {
        store.cache.setList('index', instances);
        store.index({ignoreCache: true});
        expect(store.http().get).toHaveBeenCalledWith('');
    });

    it('should fetch with custom url', () => {
        store.index({url: 'customUrl'});
        expect(store.http().get).toHaveBeenCalledWith('customUrl');
    });

    it('should convert result to list of model instances', () => {
        store.index();
        expect(store.normalizedModel).toHaveBeenCalledWith(data);
    });

    it('should add list to cache', () => {
        store.index();
        expect(store.cache.getList('index')).toBeTruthy();
    });

    it('should add model to cache', () => {
        store.cache.set = jest.fn();
        store.setIndex = true;
        store.index();
        expect(store.cache.set).toHaveBeenCalledWith(instances, false);
    });

    it('should not add model to cache', () => {
        store.cache.set = jest.fn();
        store.index();
        expect(store.cache.set).not.toHaveBeenCalled();
    });

    it('should resolve model instances', () => {
        store.index().then((result: any) => {
            expect(result).toBe(instances);
        });
    });
});
