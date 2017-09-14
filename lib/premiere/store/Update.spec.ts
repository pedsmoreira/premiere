import Helper from './Helper';
import Store from '../Store';

describe('Store update method', () => {
    let store: Store<any>;
    let data: any = {id: 1, name: 'name'};
    let responseData: any = {id: 1, name: 'name', property: 'value'};
    let instance: any = [{key: () => responseData.id}];

    beforeEach(() => {
        store = new Store<any>({keyColumn: 'id'} as any);
        store.make = jest.fn().mockReturnValue(instance);
        store.http = Helper.http(responseData);
    });

    it('should make http request', () => {
        store.update(data);
        expect(store.http().put).toHaveBeenCalledWith('1', data);
    });

    it('should request with custom url', () => {
        store.update(data, {url: 'customUrl'});
        expect(store.http().put).toHaveBeenCalledWith('customUrl', data);
    });

    it('should convert result to model instance', () => {
        store.update(data);
        expect(store.make).toHaveBeenCalledWith(responseData);
    });

    it('should add model to cache', () => {
        store.cache.set = jest.fn();
        store.update(data);
        expect(store.cache.set).toHaveBeenCalledWith(instance);
    });

    it('should resolve model instance', () => {
        store.index().then((result: any) => {
            expect(result).toBe(instance);
        });
    });
});
