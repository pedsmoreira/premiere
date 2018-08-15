// @flow

import Model from '../Model';
import Has from './Has';

export default class HasMany<T> extends Has<T[]> {
  get defaultUrl() {
    return `${this.model.pluralPath}/${this.foreignKeyValue}/${this.foreignModel.pluralPath}`;
  }

  // async create(data: Object): Promise<T> {
  // const foreignInstance = await this.foreignModel.create({
  //   [this.model.foreignKey]: this.model.primaryKey,
  //   ...data
  // });
  // // $FlowFixMe
  // this.instance[this.foreignKey] = foreignInstance.primaryKey;
  // this.data.push(foreignInstance);
  // return foreignInstance;
  // }
}
