// @flow

import Relationship from '../Relationship';
import Model from '../Model';
import Request from '../Request';

export default class BelongsTo<T> extends Relationship<T> {
  get defaultUrl() {
    return this.foreignModel.find(this.foreignKeyValue).props.url;
  }

  get defaultForeignKey() {
    return this.foreignModel.foreignKey;
  }

  create(data: Object): Request<T> {
    // const path = `${this.originModel.pluralPath}/${this.instance.identifier}/${this.foreignModel.pluralPath}`;
    // const response = await this.foreignModel.api.http.post(path, data);
    // const foreignInstance: any = this.foreignModel.make(response.data);

    // this.data = foreignInstance;
    // return foreignInstance;

    const url = `${this.originModel.pluralPath}/${this.instance.identifier}/${this.foreignModel.pluralPath}`;

    const request = this.foreignModel
      .create(data)
      .url(url)
      .after((foreignInstance: T) => {
        // $FlowFixMe
        this.instance[this.foreignKey] = foreignInstance.primaryKey;
        this.data = foreignInstance;
      });

    // $FlowFixMe
    return request;
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
