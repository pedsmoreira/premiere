import Model from './Model';
import Store from './Store';

class SpecModel extends Model {
    static singular: string = 'spec';

    id: number = 1;
    property: string = 'value';

    normalize() {
        this.property = 'normalized value';
    }

    denormalized() {
        return {property: 'denormalized value'};
    }
}

class SpyModel extends Model {
    id: string = 'spy';
    spec_id: string = 'fk';
}

describe('Store foreign method', () => {
    let model: SpecModel;
    let spyModel: SpyModel;

    beforeEach(() => {
        model = new SpecModel();
        spyModel = new SpyModel();

        let store: any = model.store() as any;
        ['index', 'get', 'where', 'create', 'update', 'by', 'foreign', 'destroy', 'act'].forEach((key) => {
            store[key] = jest.fn().mockReturnValue({then: jest.fn()});
        });

        ['find', 'save', 'destroy', 'belongsTo', 'belongsToMany', 'hasOne', 'hasMany', 'act'].forEach((key) => (SpyModel as any)[key] = jest.fn());
    });

    it('should get store', () => {
        expect(model.store()).toBeInstanceOf(Store);
    });

    it('should resolve existing store', () => {
        SpyModel.store = 'store' as any;
        expect(SpyModel.resolveStore()).toBe('store');
    });

    it('should resolve new store', () => {
        SpyModel.store = null;
        expect(SpyModel.resolveStore()).toBeInstanceOf(Store);
    });

    it('should get key', () => {
        expect(model.key()).toBe(1);
    });

    it('should get shallow map', () => {
        expect(model.shallowMap()).toEqual({id: 1, property: 'value'});
    });

    it('should get persistent map', () => {
        expect(model.persistentMap()).toEqual({id: 1, property: 'denormalized value'});
    });

    it('should get foreign key', () => {
        expect(spyModel.foreignKey(SpecModel)).toBe('fk');
    });

    it('should get foreign key name', () => {
        expect(SpecModel.foreignKey()).toBe('spec_id');
    });

    it('should set', () => {
        expect(model.set({property: 'set value'}).property).toBe('set value');
    });

    it('should duplicate', () => {
        expect(model.duplicate()).toEqual({id: 1, property: 'value'});
    });

    it('should make', () => {
        let model: SpecModel = SpecModel.make({property: 'made value'}) as SpecModel;
        expect(model.property).toBe('made value');
    });

    it('should normalize', () => {
        model.normalize();
        expect(model.property).toBe('normalized value');
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
        spyModel.persistentMap = () => 'map' as any;

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

    it('should save array', () => {
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

    it('should belong to', () => {
        spyModel.belongsTo(SpecModel, 'options');
        expect(SpyModel.belongsTo).toHaveBeenCalledWith(SpecModel, 'fk', 'options');
    });

    it('should belong to statically', () => {
        SpecModel.belongsTo(SpyModel, 'value', 'options');
        expect(SpyModel.find).toHaveBeenCalledWith('value', 'options');
    });

    it('should belong to many', () => {
        spyModel.belongsToMany(SpecModel, 'options');
        expect(SpyModel.belongsToMany).toHaveBeenCalledWith(SpecModel, 'spy', 'options');
    });

    it('should belong to many statically', () => {
        SpecModel.belongsToMany(SpyModel, 'value', 'options');
        expect(model.store().foreign).toHaveBeenCalledWith(SpyModel, 'value', 'options');
    });

    it('should have one', () => {
        spyModel.hasOne(SpecModel, 'options');
        expect(SpyModel.hasOne).toHaveBeenCalledWith(SpecModel, 'spy', 'options');
    });

    it('should have one statically', () => {
        SpecModel.hasOne(SpyModel, 'value', 'options');
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
        SpyModel.path = 'plurals';
        expect(SpyModel.singularized()).toBe('plural');
    });
});
