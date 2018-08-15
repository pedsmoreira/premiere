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

  get nestedUrl(): string {
    return `${this.originModel.pluralPath}/${this.instance.identifier}/${this.foreignModel.pluralPath}`;
  }

  create(data: Object): Request<T> {
    return this.foreignModel
      .create(data)
      .url(this.nestedUrl)
      .after(foreignInstance => {
        // $FlowFixMe
        this.instance[this.foreignKey] = foreignInstance.primaryKey;
        this.data = foreignInstance;
      });
  }

  update(data: Object): Request<T> {
    return this.foreignModel
      .update(this.foreignKeyValue, data)
      .url(`${this.nestedUrl}/${this.foreignKeyValue}`)
      .after(foreignInstance => {
        // $FlowFixMe
        this.instance[this.foreignKey] = foreignInstance.primaryKey;
        this.data = foreignInstance;
      });
  }

  destroy(): Request<T> {
    return this.foreignModel
      .destroy(this.foreignKeyValue)
      .url(`${this.nestedUrl}/${this.foreignKeyValue}`)
      .after(foreignInstance => {
        // $FlowFixMe
        this.instance[this.foreignKey] = null;
        delete this.data;
      });
  }
}
