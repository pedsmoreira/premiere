// @flow

import Model from './Model';
import Request from './Request';

export default class Relationship<T: any> extends Request<T> {
  _data: ?T;

  instance: Model;

  constructor(instance: Model, foreignModel: typeof Model) {
    super();
    this.instance = instance;

    this.target(foreignModel).transform(this.transformModel.bind(this));
  }

  transformModel(rawData: any): T {
    const model = this.foreignModel;
    // $FlowFixMe
    return (this.data = Array.isArray(rawData) ? model.newArray(rawData) : model.new(rawData));
  }

  get foreignModel(): typeof Model {
    // $FlowFixMe
    return this.props.target;
  }

  validateData(data: T): boolean {
    return true;
  }

  get hasData(): boolean {
    return !!this._data;
  }

  get hasValidData(): boolean {
    // $FlowFixMe
    return this.hasData && this.validateData(this._data);
  }

  get data(): T {
    if (!this.hasData) throw new Error(`[premiere] "data" unavailable for ${(this.props.target || {}).name}`);
    if (!this.hasValidData) throw new Error('[premiere] invalid data');

    // $FlowFixMe
    return this._data;
  }

  set data(data: T) {
    this._data = data;
  }

  foreignKey(foreignKey: string): this {
    this.props.foreignKey = foreignKey;
    return this;
  }

  get foreignKeyName(): string {
    return this.props.foreignKey || this.defaultForeignKeyName;
  }

  get defaultForeignKeyName(): string {
    return this.throwNotImplemented('defaultForeignKey');
  }

  get foreignKeyValue(): any {
    // $FlowFixMe
    return this.instance[this.foreignKeyName];
  }

  get model(): typeof Model {
    return this.instance.constructor;
  }

  fetch(): Promise<T> {
    // $FlowFixMe
    return this.hasValidData && !this.props.skipCache ? Promise.resolve(this._data) : super.fetch();
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
