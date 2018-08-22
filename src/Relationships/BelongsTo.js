// @flow

import Relationship from '../Relationship';
import Model from '../Model';
import Request from '../Request';

export default class BelongsTo<T> extends Relationship<T> {
  get defaultUrl() {
    return this.foreignModel.find(this.foreignKeyValue).props.url;
  }

  get defaultForeignKeyName() {
    return this.foreignModel.foreignKey;
  }

  create(data: Object): Request<T> {
    return this.foreignModel
      .create(data)
      .url(`${this.model.pluralPath}/${this.foreignModel.singularPath}`)
      .after(request => {
        const foreignInstance = request.transformedData;

        // $FlowFixMe
        this.instance[this.foreignKeyName] = foreignInstance.primaryKey;
        this.data = foreignInstance;
      });
  }

  update(data: Object): Request<T> {
    return this.foreignModel.update(this.foreignKeyValue, data).after(request => {
      const foreignInstance = request.transformedData;

      // $FlowFixMe
      this.instance[this.foreignKeyName] = foreignInstance.primaryKey;
      this.data = foreignInstance;
    });
  }

  destroy(): Request<T> {
    return this.foreignModel.destroy(this.foreignKeyValue).after(foreignInstance => {
      // $FlowFixMe
      this.instance[this.foreignKeyName] = null;
      delete this.data;
    });
  }
}
