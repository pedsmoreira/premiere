import Store, {IStoreBy, IStoreFetch, IStoreSet, IStoreAct} from './Store';

export interface IModel {
    key(): string
}

/**
 * A Model is usually relative to a table in the database.
 */
export default class Model implements IModel {
    /**
     * The path associated with the model
     */
    static path: string;

    /**
     * The singular name associated with the model
     * This is used for finding variable names when working with FKs
     */
    static singular: string;

    /**
     * The Store associated with the model
     * If none is given and a request is made, a new store is auto generated with the given `storeProperties`
     */
    static store: Store<Model>;

    /**
     * The name of the primary key column
     */
    static keyColumn: string = 'id';

    /**
     * This variable is used to set the default store properties
     * If you're using a custom store, don't worry about this
     */
    static storeProperties: {[_: string]: any} = {};

    /**
     * Get model store
     */
    store(): Store<this> {
        let self = this.constructor as typeof Model;
        return self.resolveStore();
    }

    /**
     * Get value of primary key
     */
    key(): any {
        let self = this.constructor as typeof Model;
        return (this as any)[self.keyColumn];
    }

    /**
     * Get mapped properties with values of model
     * The shallow map does not contain objects (consequently, does not contain FKs)
     */
    shallowMap(): {[_: string]: any} {
        let map = {};
        Object.keys(this).forEach(key => {
            let value = (this as any);
            if (typeof value !== 'object') {
                (map as any)[key] = value
            }
        });

        return map
    }

    /**
     * Get shallow map merged with denormalized values
     */
    persistentMap(): {[_: string]: any} {
        return Object.assign(this.shallowMap(), this.denormalized());
    }

    /**
     * Get foreign key name for a given model and options
     */
    static foreignKey(model: typeof Model): string {
        return `${model.underscoredName()}_${model.keyColumn}`;
    }

    /**
     * Set values to instance
     */
    set(values: {[_: string]: any}): this {
        Object.keys(values).forEach(key => {
            (this as any)[key] = values[key];
        });

        return this;
    }

    /**
     * Duplicate model
     */
    duplicate(): this {
        let self = this.constructor as typeof Model;

        let map = this.shallowMap();
        delete map[self.keyColumn];

        return self.make(map) as this;
    }

    /**
     * Create one or an array of model instances
     */
    static make(values: {[_: string]: any} | {[_: string]: any}[]): Model | Model[] {
        if (Array.isArray(values)) {
            return values.map(it => this.make(it)) as Model[];
        }
        return new this().set(values);
    }

    /**
     * Normalize model
     * This method should filled by model extensions
     */
    normalize() {
    }

    /**
     * Get array with denormalized properties
     * This method should be filled by model exteions
     */
    denormalized() {
        return {};
    }

    /**
     * Reload model instance
     */
    reload() {
        let self = this.constructor as typeof Model;
        return self.find(this.key());
    }

    /**
     * Find model object by id
     */
    static find(key: string, options: IStoreFetch = undefined) {
        return this.resolveStore().get(key, options);
    }

    /**
     * Persist model
     */
    save(options: IStoreSet = undefined) {
        let self = this.constructor as typeof Model;
        return self.save(this.persistentMap(), options);
    }

    /**
     * Create and persist one or more instances
     */
    static save(values: {[_: string]: any}, options: IStoreSet = undefined): Promise<Model> | Promise<Model>[] {
        if (Array.isArray(values)) {
            return values.map(it => this.save(it)) as Promise<Model>[];
        }

        if (values[this.keyColumn]) {
            return this.resolveStore().update(values, options);
        }

        return this.resolveStore().create(values, options);
    }

    /**
     * Destroy model
     */
    destroy(options: IStoreSet = undefined): Promise<any> {
        let self = this.constructor as typeof Model;
        return self.destroy(this.key(), options) as Promise<any>;
    }

    /**
     * Destroy
     */
    static destroy(key: string, options: IStoreSet = undefined): Promise<any> | Promise<any>[] {
        if (Array.isArray(key)) {
            return key.map(it => this.destroy(it)) as Promise<any>[];
        }
        return this.resolveStore().destroy(key, options) as Promise<any>;
    }

    /**
     * Get promise to belongsTo FK relation
     */
    belongsTo(model: typeof Model, options: IStoreFetch = {}) {
        let self = this.constructor as typeof Model;
        return self.belongsTo(model, this, options);
    }

    /**
     * Get promise to belongsTo FK relation
     */
    static belongsTo(model: typeof Model, instance: Model, options: IStoreFetch = {}) {
        let instanceType = instance.constructor as typeof Model;
        return model.find((instance as any)[instanceType.foreignKey(model)], options);
    }

    /**
     * Get promise to belongsToMany FK relation
     */
    belongsToMany(model: typeof Model, options = {}) {
        let self = this.constructor as typeof Model;
        return self.belongsToMany(model, this, options);
    }

    /**
     * Get promise to belongsToMany FK relation
     */
    static belongsToMany(model: typeof Model, instance: Model, options = {}) {
        return this.hasMany(model, instance, options);
    }

    /**
     * Get promise to hasOne FK relation
     */
    hasOne(model: typeof Model) {
        let self = this.constructor as typeof Model;
        return self.hasOne(model, this.key());
    }

    /**
     * Get promise to hasOne FK relation statically
     */
    static hasOne(model: typeof Model, value: any, options: IStoreBy = undefined) {
        return this.resolveStore().by(model, value, options);
    }

    /**
     * Get promise to hasMany FK relation
     */
    hasMany(model: typeof Model, options: IStoreBy = undefined) {
        let self = this.constructor as typeof Model;
        return self.hasMany(model, this, options);
    }

    /**
     * Get promise to hasMany FK relation statically
     */
    static hasMany(model: typeof Model, instance: Model, options: IStoreBy = {}) {
        return model.resolveStore().by(instance, null, options);
    }

    /**
     * Call action for model
     */
    act(action: string, options: IStoreAct = undefined) {
        let self = this.constructor as typeof Model;
        return self.act(this.key(), action, options);
    }

    /**
     * Call action
     */
    static act(key: string, action: string, options: IStoreAct = undefined) {
        return this.resolveStore().act(key, action, options);
    }

    /**
     * Find model object by property value
     */
    static where(property: string, value: any, options: IStoreAct = undefined) {
        return this.resolveStore().where(property, value, options);
    }

    /**
     * Get list of stores
     */
    static all(): Promise<Model[]> {
        return this.resolveStore().index() as Promise<Model[]>;
    }

    /**
     * Make http request to fetch instances by foreign key
     */
    static by(model: Model | typeof Model, value: any = undefined, options: IStoreBy = undefined) {
        return this.resolveStore().by(model, value, options);
    }

    /**
     * Get an instance of store
     */
    static resolveStore(properties = this.storeProperties, modelClass = this): Store<Model> {
        return this.store = this.store || new Store<Model>(modelClass, properties);
    }

    /**
     * Get name
     * If the `singular` variable is not defined, guess it from the `path`
     */
    static singularized() {
        return this.singular || this.path.substring(0, this.path.length - 1);
    }

    /**
     * Get capitalized name
     */
    static capitalizedSingular() {
        let name = this.singularized();
        return name.substring(0, 1).toUpperCase() + name.substring(1);
    }

    /**
     * Get path to model in unerscore case
     */
    static underscoredName() {
        return this.singularized().replace(/\.?([A-Z])/g, function (x, y) {
            return '_' + y.toLowerCase();
        }).replace(/^_/, '');
    }
}
