import Helper from './Helper';
import Store from '../Store';

describe('Store destroy method', () => {
    let store: Store<any>;
    let instance: any = {key: () => '1'};

    beforeEach(() => {
        store = new Store<any>(null);
        store.http = Helper.http(null);
    });

    it('should verify access', () => {
        store.denies = ['destroy'];
        expect(() => store.destroy(1)).toThrowError();
    });

    it('should make http request', () => {
        store.destroy(1);
        expect(store.http().delete).toHaveBeenCalledWith('1');
    });

    it('should destroy by object', () => {
        store.destroy(instance);
        expect(store.http().delete).toHaveBeenCalledWith('1');
    });

    it('should request with custom url', () => {
        store.destroy(1, {url: 'customUrl'});
        expect(store.http().delete).toHaveBeenCalledWith('customUrl');
    });

    it('should remove model to cache', () => {
        store.cache.set(instance);
        store.destroy(1);
        expect(store.cache.get(1)).toBeUndefined();
    });
});
