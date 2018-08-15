// @flow

import Relationship from '../Relationship';
import Model from '../Model';
import Request from '../Request';

export default class BelongsTo<T> extends Relationship<T> {
  get defaultUrl() {
    return this.props.nested ? this.nestedUrl : this.foreignModel.find(this.foreignKeyValue).props.url;
  }

  get nestedUrl(): string {
    return `${this.model.pluralPath}/${this.instance.identifier}/${this.foreignModel.singularPath}`;
  }

  get defaultForeignKeyName() {
    return this.foreignModel.foreignKey;
  }

  nested(): this {
    this.props.nested = true;
    return this;
  }

  get nestedUpdateUrl(): string {
    return `${this.nestedUrl}/${this.foreignKeyValue}`;
  }

  create(data: Object): Request<T> {
    const request = this.foreignModel.create(data).after(foreignInstance => {
      // $FlowFixMe
      this.instance[this.foreignKeyName] = foreignInstance.primaryKey;
      this.data = foreignInstance;
    });

    if (this.props.nested) {
      request.url(this.nestedUrl);
    } else {
      request.body(Object.assign({}, { [this.model.foreignKey]: this.instance.primaryKey }, data));
    }

    return request;
  }

  update(data: Object): Request<T> {
    const request = this.foreignModel.update(this.foreignKeyValue, data).after(foreignInstance => {
      // $FlowFixMe
      this.instance[this.foreignKeyName] = foreignInstance.primaryKey;
      this.data = foreignInstance;
    });

    if (this.props.nested) request.url(this.nestedUpdateUrl);
    return request;
  }

  destroy(): Request<T> {
    const request = this.foreignModel.destroy(this.foreignKeyValue).after(foreignInstance => {
      // $FlowFixMe
      this.instance[this.foreignKeyName] = null;
      delete this.data;
    });

    if (this.props.nested) request.url(this.nestedUpdateUrl);
    return request;
  }
}
