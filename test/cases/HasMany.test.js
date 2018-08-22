import MockAdapter from 'axios-mock-adapter';
import Model from '../../src/Model';

describe('HasMany', () => {
  class Company extends Model {
    static basename = 'company';

    normalizeName(name) {
      return name.toLowerCase();
    }
  }

  class User extends Model {
    static basename = 'user';

    get companies() {
      return this.hasMany(Company);
    }
  }

  class CustomUser extends User {
    static identifier = 'slug';
  }

  const axiosAdapter = new MockAdapter(Company.api.http);
  axiosAdapter.onGet('users/1/companies').reply(200, [{ id: 9, name: 'Business A' }, { id: 10, name: 'Business B' }]);
  axiosAdapter
    .onPost('users/1/companies', { name: 'Brand New Business' })
    .reply(200, { id: 11, name: 'Brand New Business' });

  function expectExistingCompanies(companies) {
    expect(companies).toHaveLength(2);
    expect(companies[0]).toBeInstanceOf(Company);
    expect(companies).toEqual([{ id: 9, name: 'business a' }, { id: 10, name: 'business b' }]);
  }

  describe('with the default foreignKey', () => {
    it('fetches models', async () => {
      const user = new User().set({ id: 1 });
      const companies = await user.companies.fetch();

      expectExistingCompanies(companies);
      expect(() => user.companies.data).toThrowError();
    });
  });

  describe('with a custom foreignKey', () => {
    it('fetches models', async () => {
      const user = new User().set({ id: 1 });
      const companies = await user.companies.fetch();

      expectExistingCompanies(companies);
      expect(() => user.companies.data).toThrowError();
    });
  });

  describe('with a custom identifier', () => {
    it('builds path properly', () => {
      const user = new CustomUser().set({ slug: 'doe' });
      expect(user.companies.path).toEqual('users/doe/companies');
    });

    it('builds create path properly', () => {
      const user = new CustomUser().set({ slug: 'doe' });
      expect(user.companies.create({}).path).toEqual('users/doe/companies');
    });
  });
});
