// @flow

import Relationship from '../Relationship';
import Model from '../Model';

export default class HasOne<T> extends Relationship<T> {
  get defaultUrl() {
    return `${this.model.pluralPath}/${this.foreignKeyValue}/${this.foreignModel.singularPath}`;
  }

  // async create(data: Object): Promise<T> {}
}
