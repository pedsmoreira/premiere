import Store from './Store';

describe('Store index method', () => {
    let store: Store<any>;
    let data: any = [{id: 1}];

    beforeEach(() => {
        store = new Store<any>(null);
        store.normalizedModel = jest.fn().mockReturnValue('normalized model');
        store.cache.set = jest.fn();

        let then = (fn: Function) => fn({data});
        let get = jest.fn().mockReturnValue({then});
        store.http = () => ({get} as any);
    });

    it('should verify access', () => {
        store.denies = ['index'];
        expect(() => store.index()).toThrowError();
    });

    it('should skip access verification', () => {
        store.denies = ['index'];
        store.index({permit: true});
        expect(store.http().get).toHaveBeenCalledWith('');
    });

    it('should fetch from http request', () => {
        store.index();
        expect(store.http().get).toHaveBeenCalledWith('');
    });

    it('should fetch from cache', () => {
        store.cache.setList('index', data);
        store.index().then((result) => expect(result).toBe(data));
        expect(store.http().get).not.toHaveBeenCalled();
    });

    it('should ignore cache', () => {
        store.cache.setList('index', data);
        store.index({ignoreCache: true});
        expect(store.http().get).toHaveBeenCalledWith('');
    });

    it('should fetch index with custom url', () => {
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
        store.setIndex = true;
        store.index();
        expect(store.cache.set).toHaveBeenCalledWith('normalized model', false);
    });

    it('should not add model to cache', () => {
        store.index();
        expect(store.cache.set).not.toHaveBeenCalled();
    });

    it('should resolve model instances', () => {
        store.index().then((result: any) => {
            expect(result).toBe('normalized model');
        });
    });
});
