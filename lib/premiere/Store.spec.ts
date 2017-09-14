import Store from './Store';
import Model from './Model';

describe('Store', () => {
    const data = {property: 'value'};

    describe('#construct', () => {
        it('should set model', () => {
            const store = new Store<Model>(Model);
            expect(store.model).toBe(Model);
        });

        it('should set properties', () => {
            const store = new Store<any>(null, data);
            expect((store as any).property).toBe('value');
        });

        it('should set model store', () => {
            Model.store = null;
            const store = new Store<Model>(Model, data);
            expect(Model.store).toBe(store);
        });

        it('should not set model store on construct', () => {
            Model.store = 'old store' as any;
            const store = new Store<Model>(Model, data);
            expect(Model.store).toBe('old store');
        });

        it('should not throw exception with null', () => {
            expect(() => new Store<any>(null, data)).not.toThrow();
        });
    });

    describe('#path', () => {
        const store = new Store<Model>(Model);

        it('should get path from model', () => {
            store.model.path = 'path';
            expect(store.path()).toBe('path');
        });
    });

    describe('#make', () => {
        const store = new Store<Model>(Model);

        it('should make model with given values', () => {
            Model.make = jest.fn();
            store.make(data, false);
            expect(Model.make).toHaveBeenCalledWith(data, false);
        });
    });
});
