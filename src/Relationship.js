// @flow

import Model from './Model';
import FetchRequest from './FetchRequest';

export type RelationshipOptions = {
  foreignKey?: string
};

export default class Relationship<T: any> extends FetchRequest<T> {
  _data: ?T;

  instance: Model;
  options: RelationshipOptions;

  constructor(instance: Model, foreignModel: typeof Model, options?: RelationshipOptions = {}) {
    super();
    this.instance = instance;
    this.options = options;

    this.target(foreignModel).unboundTransform(this.transformModel);
    this.setup();
  }

  setup() {}

  transformModel = (rawData: any): T => {
    const model = this.foreignModel;
    // $FlowFixMe
    return Array.isArray(rawData) ? model.makeArray(rawData) : model.make(rawData);
  };

  get foreignModel(): typeof Model {
    // $FlowFixMe
    return this.props.target;
  }

  checkDataValidity(data: T): boolean {
    return true;
  }

  get data(): T {
    const data = this._data;
    if (!data) throw new Error(`[premiere] "data" unavailable for ${this.originModel.name}`);
    if (!this.checkDataValidity(data)) throw new Error('[premiere] invalid data');

    return data;
  }

  set data(data: T) {
    this._data = data;
  }

  get foreignKey(): string {
    return this.options.foreignKey || this.defualtForeignKey;
  }

  get defualtForeignKey(): string {
    return this.throwNotImplemented('defaultForeignKey');
  }

  get foreignKeyValue(): any {
    // $FlowFixMe
    const value = this.instance[this.foreignKey];
    return value || this.throwUndefinedProperty(this.foreignKey);
  }

  get originModel(): typeof Model {
    return this.instance.constructor;
  }

  throwNotImplemented(method: string): any {
    const className = this.constructor.name;
    throw new Error(`[premiere] method "${method}" not implemented for ${className}`);
  }

  throwUndefinedProperty(property: string): any {
    const name = this.constructor.name;
    const modelName = this.originModel.name;
    throw new Error(`[premiere] Undefined property "${property}" in ${name} relationship for ${modelName}`);
  }
}
