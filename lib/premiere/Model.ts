import Store, {IStoreForeign, IStoreFetch, IStoreSet, IStoreAct} from './Store';
import Hash from './Hash';

export interface IModel {
    key(): string;
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
    static storeProperties: Hash<any> = {};

    /**
     * Get model store
     */
    store(): Store<this> {
        let self = this.constructor as typeof Model;
        return self.resolveStore();
    }

    /**
     * Get an instance of store
     */
    static resolveStore(properties = this.storeProperties, modelClass = this): Store<Model> {
        return this.store = this.store || new Store<Model>(modelClass, properties);
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
    shallowMap(): Hash<any> {
        let map: any = {};
        Object.keys(this).forEach(key => {
            let value = (this as any)[key];
            if (typeof value !== 'object') {
                map[key] = value;
            }
        });

        return map;
    }

    /**
     * Get shallow map merged with denormalized values
     */
    persistentMap(): Hash<any> {
        return Object.assign(this.shallowMap(), this.denormalized());
    }

    /**
     * Get foreign key value for a given model
     */
    foreignKey(model: typeof Model): any {
        return (this as any)[model.foreignKey()];
    }

    /**
     * Get foreign key name for a given model
     */
    static foreignKey(): string {
        return `${this.singularized()}_${this.keyColumn}`;
    }

    /**
     * Set values to instance
     */
    set(values: Hash<any>): this {
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
    static make(values: Hash<any> | Hash<any>[]): Model | Model[] {
        if (Array.isArray(values)) {
            return values.map(it => this.make(it)) as Model[];
        }
        return new this().set(values);
    }

    /**
     * Normalize model
     * This method should filled by model extensions
     */
    normalize(): void {
    }

    /**
     * Get array with denormalized properties
     * This method should be filled by model exteions
     */
    denormalized(): Hash<any> {
        return {};
    }

    /**
     * Reload model instance
     */
    reload(): Promise<this> {
        let self = this.constructor as typeof Model;
        return self.find(this.key());
    }

    /**
     * Find model object by id
     */
    static find(key: any, options: IStoreFetch = undefined): Promise<Model> {
        return this.resolveStore().get(key, options);
    }

    /**
     * Persist model
     */
    save(options: IStoreSet = undefined): Promise<this> {
        let self = this.constructor as typeof Model;
        return self.save(this.persistentMap(), options) as Promise<Model>;
    }

    /**
     * Create and persist one or more instances
     */
    static save(values: Hash<any>, options: IStoreSet = undefined): Promise<Model> | Promise<Model>[] {
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
    static destroy(key: any, options: IStoreSet = undefined): Promise<any> | Promise<any>[] {
        if (Array.isArray(key)) {
            return key.map(it => this.destroy(it)) as Promise<any>[];
        }
        return this.resolveStore().destroy(key, options) as Promise<any>;
    }

    /**
     * Get promise to belongsTo FK relation
     */
    belongsTo(model: typeof Model, options: IStoreFetch = undefined): Promise<Model> {
        let self = this.constructor as typeof Model;
        return self.belongsTo(model, this.foreignKey(model), options);
    }

    /**
     * Get promise to belongsTo FK relation
     */
    static belongsTo(model: typeof Model, value: any, options: IStoreFetch = undefined): Promise<Model> {
        return model.find(value, options);
    }

    /**
     * Get promise to belongsToMany FK relation
     */
    belongsToMany(model: typeof Model, options: IStoreForeign = undefined): Promise<this[]> {
        let self = this.constructor as typeof Model;
        return self.belongsToMany(model, this.key(), options);
    }

    /**
     * Get promise to belongsToMany FK relation
     */
    static belongsToMany(model: typeof Model, value: any, options: IStoreForeign = undefined): Promise<Model[]> {
        return this.hasMany(model, value, options);
    }

    /**
     * Get promise to hasOne FK relation
     */
    hasOne(model: typeof Model, options: IStoreForeign = undefined): Promise<Model> {
        let self = this.constructor as typeof Model;
        return self.hasOne(model, this.key(), options);
    }

    /**
     * Get promise to hasOne FK relation statically
     */
    static hasOne(model: typeof Model, key: any, options: IStoreForeign = undefined): Promise<Model> {
        return new Promise((resolve, reject) => {
            this.hasMany(model, key, options).then((objects) => {
                resolve(objects.length ? objects[0] : null);
            }, reject);
        });
    }

    /**
     * Get promise to hasMany FK relation
     */
    hasMany(model: typeof Model, options: IStoreForeign = undefined): Promise<Model[]> {
        let self = this.constructor as typeof Model;
        return self.hasMany(model, this.key(), options);
    }

    /**
     * Get promise to hasMany FK relation statically
     */
    static hasMany(model: typeof Model, key: any, options: IStoreForeign = undefined): Promise<Model[]> {
        return this.resolveStore().foreign(model, key, options);
    }

    /**
     * Call action for model
     */
    act(action: string, options: IStoreAct = undefined): Promise<any> {
        let self = this.constructor as typeof Model;
        return self.act(this.key(), action, options);
    }

    /**
     * Call action
     */
    static act(key: any, action: string, options: IStoreAct = undefined): Promise<any> {
        return this.resolveStore().act(key, action, options);
    }

    /**
     * Find model object by property value
     */
    static where(property: string, key: any, options: IStoreAct = undefined): Promise<Model> {
        return this.resolveStore().where(property, key, options);
    }

    /**
     * Get list of stores
     */
    static all(options: IStoreFetch = undefined): Promise<Model[]> {
        return this.resolveStore().index(options) as Promise<Model[]>;
    }

    /**
     * Get singularized path
     * If the `singular` variable is not defined, guess it from the `path`
     */
    static singularized(): string {
        return this.singular || this.path.substring(0, this.path.length - 1);
    }
}
