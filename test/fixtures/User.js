// @flow

import Model from '../../src/Model';
import Website from './Website';
import BelongsTo from '../../src/Relationships/BelongsTo';
import Company from './Company';

class User extends Model {
  company_id: number;

  get company(): BelongsTo<Company> {
    return this.belongsTo(Company, {
      before: rawData => {
        console.log('do something');
        return rawData;
      },
      after: company => company.cache()
    });
  }

  get websites() {
    return this.hasMany(Website, { through: Company });
  }
}
