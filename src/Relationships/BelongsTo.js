// @flow

import Relationship from '../Relationship';
import Model from '../Model';

export default class BelongsTo<T> extends Relationship<T> {
  setup() {
    this.url(this.foreignModel.find(this.foreignKeyValue).props.url);
  }

  get foreignKey() {
    return this.foreignModel.foreignKey;
  }

  get stub(): Model {
    const stub: any = new this.foreignModel();
    stub[this.foreignModel.primaryKey] = this.foreignKeyValue;
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
