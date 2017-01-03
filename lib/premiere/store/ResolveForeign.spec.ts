import Store from '../Store';

describe('Store resolve foreign method', () => {
    let store: Store<any>;
    let data = [{id: 1}];
    let instances: any = [{key: () => data[0].id}];
    let options = {url: 'url'};

    beforeEach(() => {
        store = new Store<any>(null);
        store.make = jest.fn().mockReturnValue(instances);
    });

    it('should convert single result to array', () => {
        (store as any).resolveForeign(data[0], options);
        expect(store.make).toHaveBeenCalledWith(data);
    });

    it('should convert result to list of model instances', () => {
        (store as any).resolveForeign(data, options);
        expect(store.make).toHaveBeenCalledWith(data);
    });

    it('should add list to cache', () => {
        (store as any).resolveForeign(data, options);
        expect(store.cache.getList('url')).toBeTruthy();
    });

    it('should add model to cache', () => {
        store.cache.set = jest.fn();
        (store as any).resolveForeign(data, {...options, set: true});
        expect(store.cache.set).toHaveBeenCalledWith(instances, false);
    });

    it('should not add model to cache', () => {
        store.cache.set = jest.fn();
        (store as any).resolveForeign(data, options);
        expect(store.cache.set).not.toHaveBeenCalled();
    });

    it('should resolve model instances', () => {
        expect((store as any).resolveForeign(data, options)).toBe(instances);
    });
});
