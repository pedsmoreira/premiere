// @flow

import Model from './Model';

export type RelationshipOptions = {
  key?: string,
  before?: any => any,
  after?: any => any,
  through?: typeof Model
};

export default class Relationship<T: any> {
  _data: ?T;

  instance: Model;
  foreignModel: typeof Model;
  options: RelationshipOptions;

  makeArray: boolean = false;

  constructor(instance: Model, foreignModel: typeof Model, options?: RelationshipOptions = {}) {
    this.instance = instance;
    this.foreignModel = foreignModel;
    this.options = options;
  }

  get data(): T {
    if (!this._data) throw new Error(`[premiere] "data" unavailable for ${this.model.name}`);
    return this._data;
  }

  set data(data: T) {
    this._data = data;
  }

  get foreignKey(): string {
    return this.throwNotImplemented('foreignKey');
  }

  get value(): any {
    // $FlowFixMe
    const value = this.instance[this.foreignKey];
    return value || this.throwUndefinedProperty(this.foreignKey);
  }

  get path(): string {
    return this.throwNotImplemented('path');
  }

  get model(): typeof Model {
    return this.instance.constructor;
  }

  async fetch() {
    const { data } = await this.foreignModel.api.http.get(this.path);
    this.data = this.transformRawData(data);

    const { after } = this.options;
    if (after) after(this.data);
  }

  transformRawData(rawData: Object): any {
    const { before } = this.options;
    const data = before ? before(rawData) : rawData;

    // $FlowFixMe
    return this.makeArray ? this.foreignModel.makeArray(data) : this.foreignModel.make(data);
  }

  throwNotImplemented(method: string): any {
    const className = this.constructor.name;
    throw new Error(`[premiere] method "${method}" not implemented for ${className}`);
  }

  throwUndefinedProperty(property: string): any {
    const name = this.constructor.name;
    const modelName = this.model.name;
    throw new Error(`[premiere] Undefined property "${property}" in ${name} relationship for ${modelName}`);
  }
}
