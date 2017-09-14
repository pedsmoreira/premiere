import Model from './Model';
import Store from './Store';

class SpecModel extends Model {
    static singular: string = 'spec';

    id: number = 1;
    property: string = 'value';

    static normalize_property(value: any) {
        return 'normalized ' + value;
    }

    static denormalize_property(value: any) {
        return 'denormalized ' + value;
    }
}

class SpyModel extends Model {
    id: string = 'spy';
}

describe('Store foreign method', () => {
    let model: SpecModel;
    let spyModel: SpyModel;

    const store: Store<SpecModel> = SpecModel.resolveStore() as Store<SpecModel>;
    ['index', 'get', 'where', 'create', 'update', 'by', 'foreign', 'destroy', 'act'].forEach((key) => {
        (store as any)[key] = jest.fn().mockReturnValue({then: jest.fn()});
    });

    beforeEach(() => {
        model = new SpecModel();
        spyModel = new SpyModel();

        ['find', 'save', 'destroy', 'belongsToMany', 'hasOne', 'hasMany', 'act'].forEach((key) => (SpyModel as any)[key] = jest.fn());
    });

    it('should get store', () => {
        expect(model.store()).toBeInstanceOf(Store);
    });

    it('should resolve creating store', () => {
        SpyModel.store = 'store' as any;
        expect(SpyModel.resolveStore()).toBe('store');
    });

    it('should resolve new store', () => {
        SpyModel.store = null;
        SpyModel.createStore = jest.fn();

        SpyModel.resolveStore('properties' as any);
        expect(SpyModel.createStore).toHaveBeenCalledWith('properties');
    });

    it('should create store', () => {
        expect(SpecModel.createStore()).toBeInstanceOf(Store);
    });

    it('should create store with properties', () => {
        let store = SpecModel.createStore({property: 'value'});
        expect((store as any).property).toBe('value');
    });

    it('should get key', () => {
        expect(model.key()).toBe(1);
    });

    it('should map', () => {
        expect(model.map()).toEqual({id: 1, property: 'denormalized value'});
    });

    it('should map without denormalizing', () => {
        expect(model.map(false)).toEqual({id: 1, property: 'value'});
    });

    it('should get foreign key', () => {
        SpyModel.singular = 'spy';
        (model as any).spy_id = 'fk';
        expect(model.foreignKey(SpyModel)).toBe('fk');
    });

    it('should get foreign key name', () => {
        expect(SpecModel.foreignKey()).toBe('spec_id');
    });

    it('should resolve normalizer', () => {
        expect(SpecModel.resolveTransformer('property')).toBe('normalize_property');
    });

    it('should resolve denormalizer', () => {
        expect(SpecModel.resolveTransformer('property', 'denormalize')).toBe('denormalize_property');
    });

    it('should resolve camelCase normalizer', () => {
        (SpyModel as any).normalize_my_property = null;
        (SpyModel as any).normalizeMyProperty = jest.fn();
        expect(SpyModel.resolveTransformer('my_property')).toBe('normalizeMyProperty');
    });

    it('should normalize', () => {
        expect(SpecModel.normalize('property', 'value')).toBe('normalized value');
    });

    it('should denormalize', () => {
        expect(SpecModel.denormalize('property', 'value')).toBe('denormalized value');
    });

    it('should set', () => {
        SpyModel.normalize = jest.fn();
        model.set({property: 'set value'});
        expect(model.property).toBe('set value');
        expect(SpyModel.normalize).not.toHaveBeenCalled();
    });

    it('should set and normalize', () => {
        SpyModel.normalize = jest.fn();
        spyModel.set({property: 'value'}, true);
        expect(SpyModel.normalize).toHaveBeenCalledWith('property', 'value');
    });

    it('should duplicate', () => {
        expect(model.duplicate()).toEqual({id: 1, property: 'value'});
    });

    it('should make', () => {
        let model: SpecModel = SpecModel.make({property: 'made value'}) as SpecModel;
        expect(model.property).toBe('made value');
    });

    it('should make array', () => {
        expect(Array.isArray(SpecModel.make([1, 2]))).toBeTruthy();
    });

    it('should make and normalize', () => {
        SpyModel.normalize = jest.fn();
        SpyModel.make({property: 'value'}, true);
        expect(SpyModel.normalize).toHaveBeenCalledWith('property', 'value');
    });

    it('should resolve first', () => {
        return (SpecModel as any).resolveFirst(Promise.resolve(['value', 'second'])).then((data: any) => {
            expect(data).toBe('value');
        });
    });

    it('should resolve null', () => {
        return (SpecModel as any).resolveFirst(Promise.resolve([])).then((data: any) => {
            expect(data).toBeNull();
        });
    });

    it('should reload', () => {
        spyModel.reload();
        expect(SpyModel.find).toHaveBeenCalledWith('spy');
    });

    it('should find', () => {
        SpecModel.find(1, 'options');
        expect(model.store().get).toHaveBeenCalledWith(1, 'options');
    });

    it('should save', () => {
        spyModel.map = () => 'map' as any;

        spyModel.save('options');
        expect(SpyModel.save).toHaveBeenCalledWith('map', 'options');
    });

    it('should create', () => {
        let data = {name: 'name'};
        SpecModel.save(data, 'options');
        expect(model.store().create).toHaveBeenCalledWith(data, 'options');
    });

    it('should update', () => {
        let data = {id: 1, name: 'name'};
        SpecModel.save(data, 'options');
        expect(model.store().update).toHaveBeenCalledWith(data, 'options');
    });

    it('should create statically', () => {
        let properties = {property: 'values'};
        SpecModel.save(properties, 'options');
        expect(store.create).toHaveBeenCalledWith(properties, 'options');
    });

    it('should update statically', () => {
        let properties = {id: 'id', property: 'values'};
        SpecModel.save(properties, 'options');
        expect(store.update).toHaveBeenCalledWith(properties, 'options');
    });

    it('should save array statically', () => {
        expect(Array.isArray(SpecModel.save([1, 2]))).toBeTruthy();
    });

    it('should destroy', () => {
        spyModel.destroy('options');
        expect(SpyModel.destroy).toHaveBeenCalledWith('spy', 'options');
    });

    it('should destroy statically', () => {
        SpecModel.destroy(1, 'options');
        expect(model.store().destroy).toHaveBeenCalledWith(1, 'options');
    });

    it('should destroy array statically', () => {
        expect(Array.isArray(SpecModel.destroy([1, 1], 'options'))).toBeTruthy();
    });

    it('should belong to', () => {
        SpyModel.singular = 'spy';
        (model as any).spy_id = 'fk';

        model.belongsTo(SpyModel, 'options');
        expect(SpyModel.find).toHaveBeenCalledWith('fk', 'options');
    });

    it('should belong to many', () => {
        (model as any).spy_id = 'fk';
        model.belongsToMany(SpyModel, 'options');
        expect(SpyModel.hasMany).toHaveBeenCalledWith(SpecModel, 'fk', 'options');
    });

    it('should belong to many statically', () => {
        SpecModel.belongsToMany(SpyModel, 'value', 'options');
        expect(SpyModel.hasMany).toHaveBeenCalledWith(SpecModel, 'value', 'options');
    });

    it('should have one', () => {
        spyModel.hasOne(SpecModel, 'options');
        expect(SpyModel.hasOne).toHaveBeenCalledWith(SpecModel, 'spy', 'options');
    });

    it('should have one statically', () => {
        (SpecModel as any).resolveFirst = jest.fn().mockReturnValue('resolve first');
        expect(SpecModel.hasOne(SpyModel, 'value', 'options')).toBe('resolve first');
        expect(model.store().foreign).toHaveBeenCalledWith(SpyModel, 'value', 'options');
    });

    it('should have many', () => {
        spyModel.hasMany(SpecModel, 'options');
        expect(SpyModel.hasMany).toHaveBeenCalledWith(SpecModel, 'spy', 'options');
    });

    it('should have many statically', () => {
        SpecModel.hasMany(SpyModel, 'value', 'options');
        expect(model.store().foreign).toHaveBeenCalledWith(SpyModel, 'value', 'options');
    });

    it('should act', () => {
        spyModel.act('action', 'options');
        expect(SpyModel.act).toHaveBeenCalledWith('spy', 'action', 'options');
    });

    it('should act statically', () => {
        SpecModel.act('key', 'value', 'options');
        expect(model.store().act).toHaveBeenCalledWith('key', 'value', 'options');
    });

    it('should get by property', () => {
        SpecModel.where('property', 'value', 'options');
        expect(model.store().where).toHaveBeenCalledWith('property', 'value', 'options');
    });

    it('should fetch all', () => {
        SpecModel.all('options');
        expect(model.store().index).toHaveBeenCalledWith('options');
    });

    it('should get singular path', () => {
        expect(SpecModel.singularized()).toBe('spec');
    });

    it('should guess singular path', () => {
        SpyModel.singular = null;
        SpyModel.path = 'plurals';
        expect(SpyModel.singularized()).toBe('plural');
    });
});
