// @flow

import Relationship from '../Relationship';
import Model from '../Model';
import Request from '../Request';

export default class BelongsTo<T> extends Relationship<T> {
  get defaultUrl() {
    return this.props.nested
      ? `${this.model.pluralPath}/${this.instance.identifier}/${this.foreignModel.singularPath}`
      : this.foreignModel.find(this.foreignKeyValue).props.url;
  }

  get defaultForeignKeyName() {
    return this.foreignModel.foreignKey;
  }

  nested(): this {
    this.props.nested = true;
    return this;
  }

  get nestedUrl(): string {
    return `${this.model.pluralPath}/${this.instance.identifier}/${this.foreignModel.singularPath}`;
  }

  create(data: Object): Request<T> {
    return this.foreignModel
      .create(data)
      .url(this.nestedUrl)
      .after(foreignInstance => {
        // $FlowFixMe
        this.instance[this.foreignKeyName] = foreignInstance.primaryKey;
        this.data = foreignInstance;
      });
  }

  update(data: Object): Request<T> {
    return this.foreignModel
      .update(this.foreignKeyValue, data)
      .url(`${this.nestedUrl}/${this.foreignKeyValue}`)
      .after(foreignInstance => {
        // $FlowFixMe
        this.instance[this.foreignKeyName] = foreignInstance.primaryKey;
        this.data = foreignInstance;
      });
  }

  destroy(): Request<T> {
    return this.foreignModel
      .destroy(this.foreignKeyValue)
      .url(`${this.nestedUrl}/${this.foreignKeyValue}`)
      .after(foreignInstance => {
        // $FlowFixMe
        this.instance[this.foreignKeyName] = null;
        delete this.data;
      });
  }
}
