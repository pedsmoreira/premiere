import Helper from './Helper';
import Store from '../Store';

describe('Store destroy method', () => {
    let store: Store<any>;

    beforeEach(() => {
        store = new Store<any>({keyColumn: 'id'} as any);
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

    it('should request with custom url', () => {
        store.destroy(1, {url: 'customUrl'});
        expect(store.http().delete).toHaveBeenCalledWith('customUrl');
    });

    it('should remove model to cache', () => {
        store.cache.destroy = jest.fn();
        store.destroy(1);
        expect(store.cache.destroy).toHaveBeenCalledWith('1');
    });
});
