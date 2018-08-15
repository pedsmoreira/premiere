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
    .onPost('companies', { name: 'Brand New Business', user_id: 1 })
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

  describe('with the default foreignKey', () => {
    it('fetches model', async () => {
      const user = new User().set({ company_id: 10, role_id: 20 });
      const company = await user.company.fetch();

      expectExistingCompany(company);
      expect(() => user.company.data).toThrowError();
    });

    it('creates foreign dependency', async () => {
      const user = new User().set({ id: 1 });
      const company = await user.company.create({ name: 'Brand New Business' }).fetch();

      expectNewCompany(company);
      expect(user.company_id).toEqual(company.id);
      expect(user.company.data).toBe(company);
    });

    it('updates foreign dependency', async () => {
      const user = new User().set({ company_id: 10 });
      const company = await user.company.update({ name: 'Updated Business Name' }).fetch();

      expectUpdatedCompany(company);
      expect(user.company_id).toEqual(company.id);
      expect(user.company.data).toBe(company);
    });
  });

  describe('with a custom foreignKey', () => {
    it('fetches model', async () => {
      const user = new User().set({ custom_company_key: 10 });
      const company = await user.company.foreignKey('custom_company_key').fetch();

      expectExistingCompany(company);
      expect(() => user.company.data).toThrowError();
    });

    it('creates foreign dependency', async () => {
      const user = new User().set({ id: 1 });
      const company = await user.company
        .foreignKey('custom_company_key')
        .create({ name: 'Brand New Business' })
        .fetch();

      expectNewCompany(company);
      expect(user.custom_company_key).toEqual(company.id);
      expect(user.company.data).toBe(company);
    });
  });

  describe('nested', () => {
    it('builds model url properly', () => {
      const user = new User().set({ slug: 'doe' });
      expect(user.company.nested().path).toEqual('users/doe/company');
    });

    it('builds model create url properly', () => {
      const user = new User().set({ slug: 'doe' });
      const request = user.company.nested().create({ name: 'Name' });
      expect(request.path).toEqual('users/doe/company');
      expect(request.props.body).toEqual({ name: 'Name' });
    });

    it('build model update url properly', () => {
      const user = new User().set({ slug: 'doe', company_id: 10 });
      const request = user.company.nested().update({ name: 'Name' });
      expect(request.path).toEqual('users/doe/company/10');
      expect(request.props.body).toEqual({ name: 'Name' });
    });
  });
});
