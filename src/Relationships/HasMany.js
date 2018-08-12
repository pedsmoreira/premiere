// @flow

import Relationship from '../Relationship';
import Model from '../Model';

export default class HasMany<T> extends Relationship<T[]> {
  get path() {
    return `${this.model.basename}/${this.instance.identifier}/${this.foreignModel.basename}`;
  }

  async create(data: Object): Promise<T> {
    // const foreignInstance = await this.foreignModel.create({
    //   [this.model.foreignKey]: this.model.primaryKey,
    //   ...data
    // });
    // // $FlowFixMe
    // this.instance[this.foreignKey] = foreignInstance.primaryKey;
    // this.data.push(foreignInstance);
    // return foreignInstance;
  }
}
