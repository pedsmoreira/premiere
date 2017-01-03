import Store from './Store';
import Model from './Model';

describe('Store', () => {
    let store: Store<Model>;
    let data = {property: 'value'};

    beforeEach(() => {
        store = new Store<Model>(Model);
    });

    it('should set model on construct', () => {
        expect(store.model).toBe(Model);
    });

    it('should set properties on construct', () => {
        let store = new Store<any>(null, data);
        expect((store as any).property).toBe('value');
    });

    it('should set model store on construct', () => {
        Model.store = null;
        let store = new Store<Model>(Model, data);
        expect(Model.store).toBe(store);
    });

    it('should not set model store on construct', () => {
        Model.store = 'old store' as any;
        let store = new Store<Model>(Model, data);
        expect(Model.store).toBe('old store');
    });

    it('should get path from model', () => {
        store.model.path = 'path';
        expect(store.path()).toBe('path');
    });

    it('should be allowed to call method without restrictions set', () => {
        expect(store.isMethodAllowed('any')).toBeTruthy();
    });

    it('should not be allowed to call denied method', () => {
        store.denies = ['method'];
        expect(store.isMethodAllowed('method')).toBeFalsy();
    });

    it('should not be allowed to call method not in allowed list', () => {
        store.allows = ['method'];
        expect(store.isMethodAllowed('anotherMethod')).toBeFalsy();
    });

    it('should not throw exception verifying allowed method', () => {
        store.allows = ['method'];
        expect(() => store.verifyPermission('method')).not.toThrow();
    });

    it('should throw exception verifying forbidden method', () => {
        store.denies = ['method'];
        expect(() => store.verifyPermission('method')).toThrowError();
    });

    it('should make model with given values', () => {
        Model.make = jest.fn();
        store.make(data, 'normalize' as any);
        expect(Model.make).toHaveBeenCalledWith(data, 'normalize');
    });
});
