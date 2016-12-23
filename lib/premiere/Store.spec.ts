import Store from './Store';
import Model from './Model';

class NormalizedModel extends Model {
    property: string;

    normalize() {
        this.property = this.property + '_normalized';
    }
}

describe('Store', () => {
    let store: Store<NormalizedModel>;
    let data = {property: 'value'};

    beforeEach(() => {
        store = new Store<NormalizedModel>(NormalizedModel);
    });

    it('should set model on construct', () => {
        expect(store.model).toBe(NormalizedModel);
    });

    it('should set properties on construct', () => {
        let store = new Store<any>(null, data);
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
        let model = store.modelInstance(data) as NormalizedModel;
        expect(model.property).toBe('value');
        expect(model).toBeInstanceOf(NormalizedModel);
    });

    it('should get normalized model with given values', () => {
        expect((store.normalizedModel(data) as any).property).toBe('value_normalized');
    });

    it('should get normalized array of models with given array of values', () => {
        expect((store.normalizedModel([data]) as any)[0].property).toBe('value_normalized');
    });
});
