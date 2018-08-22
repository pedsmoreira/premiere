// @flow

import Model from '../Model';
import Has from './Has';
import Request from '../Request';

export default class HasMany<T> extends Has<T[]> {
  get defaultUrl() {
    return `${this.model.pluralPath}/${this.foreignKeyValue}/${this.foreignModel.pluralPath}`;
  }

  create(data: Object): Request<T> {
    return this.foreignModel
      .create(data)
      .url(this.defaultUrl)
      .after(foreignInstance => {
        // $FlowFixMe
        const data = this.instance[this.foreignKeyName].data || [];
        data.push(foreignInstance);
      });
  }
}
