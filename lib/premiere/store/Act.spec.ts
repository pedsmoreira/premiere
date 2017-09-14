import Helper from './Helper';
import Store from '../Store';

describe('Store act method', () => {
    let store: Store<any>;

    beforeEach(() => {
        store = new Store<any>(null);
        store.http = Helper.http(null);
    });

    it('should make http request', () => {
        store.act(1, 'action');
        expect(store.http().put).toHaveBeenCalledWith('1/action', undefined);
    });

    it('should request with custom url', () => {
        store.act(1, 'action', {url: 'customUrl'});
        expect(store.http().put).toHaveBeenCalledWith('customUrl', undefined);
    });

    it('should request with given method', () => {
        store.act(1, 'action', {method: 'post'});
        expect(store.http().post).toHaveBeenCalledWith('1/action', undefined);
    });

    it('should request with data', () => {
        let data = {property: 'value'};
        store.act(1, 'action', {data: data});
        expect(store.http().put).toHaveBeenCalledWith('1/action', data);
    });
});
