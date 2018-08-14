// @flow

import Relationship from '../Relationship';
import Model from '../Model';

export default class BelongsTo<T> extends Relationship<T> {
  async fetch(): Promise<T> {
    // $FlowFixMe
    this.data = await this.foreignModel.find(this.value);
    return this.data;
  }

  get guessedKey() {
    return this.instance.identifier;
  }

  get foreignKey() {
    return this.foreignModel.foreignKey;
  }

  get stub(): Model {
    // $FlowFixMe
    const primaryKey = this.instance[this.foreignKey];

    const stub = new this.foreignModel();

    // $FlowFixMe
    stub[this.foreignModel.primaryKey] = primaryKey;

    // $FlowFixMe
    return stub;
  }

  async create(data: Object): Promise<T> {
    const foreignInstance = await this.foreignModel.create(data);

    // $FlowFixMe
    this.instance[this.foreignKey] = foreignInstance.primaryKey;

    this.data = foreignInstance;
    return foreignInstance;
  }

  async update(data: Object): Promise<T> {
    const foreignInstance = await this.stub.update(data);
    // $FlowFixMe
    this.data = foreignInstance;

    return this.data;
  }

  async destroy(): Promise<void> {
    await this.stub.destroy();

    // $FlowFixMe
    this.instance[this.foreignKey] = null;
    delete this.data;
  }
}
