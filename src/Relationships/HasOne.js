// @flow

import Relationship from '../Relationship';
import Model from '../Model';
import Has from './Has';
import Request from '../Request';

export default class HasOne<T> extends Has<T> {
  get defaultUrl() {
    return `${this.model.pluralPath}/${this.foreignKeyValue}/${this.foreignModel.singularPath}`;
  }

  create(data: Object): Request<T> {
    return this.foreignModel
      .create(data)
      .url(this.defaultUrl)
      .after(request => (this.data = request.transformedData));
  }

  update(data: Object): Request<T> {
    return this.foreignModel.update(this.foreignKeyValue, data).after(request => (this.data = request.transformedData));
  }

  destroy(): Request<T> {
    return this.foreignModel.destroy(this.foreignKeyValue).after(foreignInstance => {
      delete this.data;
    });
  }
}
