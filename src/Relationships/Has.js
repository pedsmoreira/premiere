// @flow

import Relationship from '../Relationship';
import BelongsTo from './BelongsTo';

export default class Has<T> extends Relationship<T> {
  get model() {
    const { through } = this;
    return through ? through.foreignModel : super.model;
  }

  through(belongsTo: BelongsTo<*>) {
    this.props.through = belongsTo;
  }

  get defaultForeignKeyName() {
    const { through } = this;
    return through ? through.foreignModel.foreignKey : this.instance.constructor.identifier;
  }
}
