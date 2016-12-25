import Helper from './Helper';
import Store from '../Store';

describe('Store act method', () => {
    let store: Store<any>;

    beforeEach(() => {
        store = new Store<any>(null);
        store.http = Helper.http(null);
    });

    it('should verify access', () => {
        store.denies = ['act'];
        expect(() => store.act(1, 'action')).toThrowError();
    });

    it('should skip access verification', () => {
        store.denies = ['act'];
        expect(() => store.act(1, 'action', {permit: true})).not.toThrow();
    });

    it('should make http request', () => {
        store.act(1, 'action');
        expect(store.http().put).toHaveBeenCalledWith('1/action');
    });

    it('should request with custom url', () => {
        store.act(1, 'action', {url: 'customUrl'});
        expect(store.http().put).toHaveBeenCalledWith('customUrl');
    });

    it('should request with given method', () => {
        store.act(1, 'action', {method: 'post'});
        expect(store.http().post).toHaveBeenCalledWith('1/action');
    });

    it('should request with data', () => {
        let data = {property: 'value'};
        store.act(1, 'action', {data: data});
        expect(store.http().put).toHaveBeenCalledWith('1/action', data);
    });
});
