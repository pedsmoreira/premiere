import Helper from './Helper';
import Store from '../Store';

describe('Store create method', () => {
    let store: Store<any>;
    let data: any = {name: 'name'};
    let responseData: any = {id: 1, name: 'name'};
    let instance: any = {key: () => responseData.id};

    beforeEach(() => {
        store = new Store<any>(null);
        store.make = jest.fn().mockReturnValue(instance);
        store.http = Helper.http(responseData);
    });

    it('should verify access', () => {
        store.denies = ['create'];
        expect(() => store.create(data)).toThrowError();
    });

    it('should make http request', () => {
        store.create(data);
        expect(store.http().post).toHaveBeenCalledWith('', data);
    });

    it('should request with custom url', () => {
        store.create(data, {url: 'customUrl'});
        expect(store.http().post).toHaveBeenCalledWith('customUrl', data);
    });

    it('should convert result to model instance', () => {
        store.create(data);
        expect(store.make).toHaveBeenCalledWith(responseData);
    });

    it('should add model to cache', () => {
        store.cache.set = jest.fn();
        store.create(data);
        expect(store.cache.set).toHaveBeenCalledWith(instance);
    });

    it('should resolve model instance', () => {
        store.index().then((result: any) => {
            expect(result).toBe(instance);
        });
    });
});
