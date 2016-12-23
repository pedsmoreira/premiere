import Store from './Store';
import Model from './Model';
import Mock = jest.Mock;

describe('Store', () => {
    let store: Store<Model>;

    beforeEach(() => {
        store = new Store<Model>(Model);

        let [get, post, put] = Array(3).fill(0).map(() => {
            let callback = (fn: Function) => fn({data: 'data'});
            return jest.fn().mockReturnValue({then: callback});
        });
        store.http = () => ({get, post, put} as any);
    });

    it('should set model on construct', () => {
        expect(store.model).toBe(Model);
    });

    it('should set properties on construct', () => {
        let store = new Store<any>(null, {property: 'value'});
        expect((store as any).property).toBe('value');
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
        expect(store.isMethodAllowed('method'));
    });

    it('should not be allowed to call method not in allowed list', () => {
        store.allows = ['method'];
        expect(store.isMethodAllowed('anotherMethod'));
    });

    it('should throw exception verifying forbidden method', () => {
        store.denies = ['method'];
        expect(() => store.verifyPermission('method')).toThrowError();
    });

    it('should get model instance with given values', () => {
        let model = store.modelInstance({property: 'value'});
        expect((model as any).property).toBe('value');
        expect(model).toBeInstanceOf(Model);
    });

    it('should get normalized model with given values', () => {
        store.modelInstance = (values: any) => Model.make({
            normalize() {
                (this as any).property = values.property + '_normalized';
            }
        });

        let normalized = store.normalizedModel({property: 'value'}) as Model;
        expect((normalized as any).property).toBe('value_normalized');
    });

    it('should get normalized array of models with given array of values', () => {
        store.modelInstance = (values: any) => Model.make(Object.assign({
            normalize() {
                (this as any).property = values.property + '_normalized';
            }
        }));

        let normalized = store.normalizedModel([{property: 'value'}]) as Model[];
        expect((normalized[0] as any).property).toBe('value_normalized');
    });
});
