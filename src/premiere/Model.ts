import Store, {
  FetchOptions,
  FetchListOptions,
  Options,
  ActOptions
} from "./Store";
import Hash from "./Hash";
import { camelize } from "./helpers/StringHelper";

export interface IModel {
  key: string;
}

export default class Model implements IModel {
  keyColumn: string = "id";
  path: string;
  private _singular: string;

  private static _store: Store<Model>;
  private static _reflector: Model;

  static storeProperties: Hash<any> = {};

  get self(): typeof Model {
    return this.constructor as typeof Model;
  }

  static get reflector(): Model {
    const reflector = this._reflector;
    if (reflector && reflector instanceof this) {
      return reflector;
    }

    return (this._reflector = new this());
  }

  get store(): Store<this> {
    return (this.constructor as typeof Model).store as Store<this>;
  }

  static get hasStore(): boolean {
    return !!this._store;
  }

  static get store(): Store<Model> {
    return (this._store =
      this._store || new Store<Model>(this, this.storeProperties));
  }

  static set store(value: Store<Model>) {
    this._store = value;
  }

  get key(): any {
    return (this as any)[this.keyColumn];
  }

  set key(value: any) {
    (this as any)[this.keyColumn] = value;
  }

  static key(value: any | IModel): string {
    if (value === null || typeof value === "undefined") {
      throw new Error("Unable to resolve key `" + value + "`");
    }

    if (typeof value === "object") {
      return (value as IModel).key;
    }

    return value;
  }

  get singular(): string {
    return this._singular || this.path.substring(0, this.path.length - 1);
  }

  set singular(value: string) {
    this._singular = value;
  }

  get foreignName(): string {
    return `${this.singular}_${this.keyColumn}`;
  }

  foreignKey(foreignModel: typeof Model): any {
    return (this as any)[foreignModel.reflector.foreignName];
  }

  get map(): Hash<any> {
    const result: Hash<any> = {};

    Object.keys(this).forEach(attribute => {
      const mapping = this.mappingFor(attribute);
      if (mapping !== null) {
        result[attribute] = mapping;
      }
    });

    return result;
  }

  private mappingFor(attribute: string): any {
    let value = (this as any)[attribute];
    if (
      typeof value === "object" ||
      typeof value === "function" ||
      this.self.reflector.hasOwnProperty(attribute)
    ) {
      return null;
    }

    return this.denormalized(attribute, value);
  }

  private transformer(attribute: string, type: string): string | null {
    const underscored: string = `${type}_${attribute}`;
    if ((this as any)[underscored]) {
      return underscored;
    }

    const camel: string = type + camelize(attribute);
    if ((this as any)[camel]) {
      return camel;
    }
  }

  private transform(attribute: string, value: any, type: string): string {
    const transformer = this.transformer(attribute, type);
    return transformer ? (this as any)[transformer](value) : value;
  }

  normalized(attribute: string, value: any): any {
    return this.transform(attribute, value, "normalize");
  }

  denormalized(attribute: string, value: any): any {
    return this.transform(attribute, value, "denormalize");
  }

  set(values: Hash<any>): this {
    Object.keys(values).forEach(key => {
      (this as any)[key] = this.normalized(key, values[key]);
    });
    return this;
  }

  duplicate(): this {
    const result: any = Object.assign(new this.self(), this);
    delete result[this.keyColumn];

    return result;
  }

  static make(values: Hash<any>): Model {
    return new this().set(values);
  }

  static makeArray(valuesArray: Hash<any>[]): Model[] {
    return valuesArray.map((values: Hash<any>) => this.make(values)) as Model[];
  }

  reload(): Promise<this> {
    return this.self.find(this.key);
  }

  static find(key: any, options?: FetchOptions): Promise<Model> {
    return this.store.get(key, options);
  }

  static all(options?: FetchOptions): Promise<Model[]> {
    return this.store.index(options);
  }

  create(options?: Options): Promise<this> {
    return this.self.create(this.map, options) as Promise<this>;
  }

  static create(values: Hash<any>, options?: Options): Promise<Model> {
    return this.store.create(values, options);
  }

  update(options?: Options): Promise<this> {
    return this.self.update(this.key, this.map, options) as Promise<this>;
  }

  static update(
    key: any,
    values: Hash<any>,
    options?: Options
  ): Promise<Model> {
    return this.store.update(key, values, options);
  }

  save(options?: Options): Promise<this> {
    return this.self.save(this.map, options) as Promise<this>;
  }

  static save(values: Hash<any>, options?: Options): Promise<Model> {
    if (values[this.reflector.keyColumn]) {
      return this.update(values[this.reflector.keyColumn], values, options);
    }

    return this.create(values, options);
  }

  destroy(options?: Options): Promise<any> {
    return this.self.destroy(this.key, options) as Promise<any>;
  }

  static destroy(key: any, options?: Options): Promise<any> {
    return this.store.destroy(key, options) as Promise<any>;
  }

  belongsTo(
    foreignModel: typeof Model,
    options?: FetchOptions
  ): Promise<Model> {
    return foreignModel.find(this.foreignKey(foreignModel), options);
  }

  belongsToMany(
    foreignModel: typeof Model,
    options?: FetchListOptions
  ): Promise<Model[]> {
    return this.self.belongsToMany(
      foreignModel,
      this.foreignKey(foreignModel),
      options
    );
  }

  static belongsToMany(
    foreignModel: typeof Model,
    value: any,
    options?: FetchListOptions
  ): Promise<Model[]> {
    return foreignModel.hasMany(this, value, options);
  }

  hasOne(
    foreignModel: typeof Model,
    options?: FetchListOptions
  ): Promise<Model> {
    return this.self.hasOne(foreignModel, this.key, options);
  }

  static async hasOne(
    foreignModel: typeof Model,
    key: any,
    options?: FetchListOptions
  ): Promise<Model | null> {
    const items = await this.hasMany(foreignModel, key, options);
    return items.length ? items[0] : null;
  }

  hasMany(
    foreignModel: typeof Model,
    options?: FetchListOptions
  ): Promise<Model[]> {
    return this.self.hasMany(foreignModel, this.key, options);
  }

  static hasMany(
    foreignModel: typeof Model,
    key: any,
    options?: FetchListOptions
  ): Promise<Model[]> {
    return this.store.foreign(foreignModel, key, options);
  }

  act(options?: ActOptions): Promise<any> {
    if (!options) {
      options = {};
    }

    options.url = options.url || this.key;
    return this.self.act(options);
  }

  static act(options?: ActOptions): Promise<any> {
    return this.store.act(options);
  }
}
