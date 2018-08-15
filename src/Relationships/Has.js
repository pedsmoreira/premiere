// @flow

import Relationship from '../Relationship';
import BelongsTo from './BelongsTo';

export default class Has<T> extends Relationship<T> {
  get model() {
    const { through } = this.props;
    return through ? through.foreignModel : super.model;
  }

  through(belongsTo: BelongsTo<*>) {
    this.props.through = belongsTo;
  }

  get defaultForeignKeyName() {
    const { through } = this.props;
    return through ? through.foreignKeyName : this.model.identifier;
  }
}
