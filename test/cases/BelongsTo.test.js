import MockAdapter from 'axios-mock-adapter';
import Model from '../../src/Model';

describe('Find', () => {
  class Company extends Model {
    static basename = 'company';

    normalizeName(name) {
      return name.toLowerCase();
    }
  }

  class User extends Model {
    static basename = 'user';
    static identifier = 'slug';

    get company() {
      return this.belongsTo(Company);
    }
  }

  const axiosAdapter = new MockAdapter(Company.api.http);
  axiosAdapter.onGet('companies/10').reply(200, { id: 10, name: 'Business A' });
  axiosAdapter
    .onPost('users/1/company', { name: 'Brand New Business' })
    .reply(200, { id: 11, name: 'Brand New Business' });
  axiosAdapter
    .onPut('companies/10', { name: 'Updated Business Name' })
    .reply(200, { id: 10, name: 'Updated Business Name' });

  function expectExistingCompany(company) {
    expect(company).toBeInstanceOf(Company);
    expect(company).toEqual({
      id: 10,
      name: 'business a'
    });
  }

  function expectNewCompany(company) {
    expect(company).toBeInstanceOf(Company);
    expect(company).toEqual({
      id: 11,
      name: 'brand new business'
    });
  }

  function expectUpdatedCompany(company) {
    expect(company).toBeInstanceOf(Company);
    expect(company).toEqual({
      id: 10,
      name: 'updated business name'
    });
  }

  describe('without skipCache', () => {
    it('caches model', async () => {
      const user = User.new({ company_id: 10 });
      expect(await user.company).toBe(await user.company);
    });
  });

  describe('with skipCache', () => {
    it('does not caches model', async () => {
      const user = User.new({ company_id: 10 });
      expect(await user.company.skipCache()).not.toBe(await user.company);
    });
  });

  describe('with the default foreignKey', () => {
    it('fetches model', async () => {
      const user = User.new({ company_id: 10 });
      const company = await user.company;

      expectExistingCompany(company);
      expect(user.company.data).toBe(company);
    });

    it('creates foreign dependency', async () => {
      const user = User.new({ id: 1 });
      const company = await user.company.create({ name: 'Brand New Business' });

      expectNewCompany(company);
      expect(user.company_id).toEqual(company.id);
      expect(user.company.data).toBe(company);
    });

    it('updates foreign dependency', async () => {
      const user = User.new({ company_id: 10 });
      const company = await user.company.update({ name: 'Updated Business Name' });

      expectUpdatedCompany(company);
      expect(user.company_id).toEqual(company.id);
      expect(user.company.data).toBe(company);
    });
  });

  describe('with a custom foreignKey', () => {
    it('fetches model', async () => {
      const user = User.new({ custom_company_key: 10 });
      const company = await user.company.foreignKey('custom_company_key');

      expectExistingCompany(company);
      expect(() => user.company.data).toThrowError();
    });

    it('creates foreign dependency', async () => {
      const user = User.new({ id: 1 });
      const company = await user.company.foreignKey('custom_company_key').create({ name: 'Brand New Business' });

      expectNewCompany(company);
      expect(user.custom_company_key).toEqual(company.id);
      expect(user.company.data).toBe(company);
    });
  });
});
