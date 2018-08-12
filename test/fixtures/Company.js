import Model from '../../src/Model';

export default class Company extends Model {
  static basename = 'company';

  get websites() {
    return this.hasMany(Website);
  }
}
