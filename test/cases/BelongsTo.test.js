import MockAdapter from 'axios-mock-adapter';
import Model from '../../src/Model';

describe('Find', () => {
  class Company extends Model {
    static basename = 'company';

    normalizeName(name) {
      return name.toLowerCase();
    }
  }

  class Role extends Model {
    static basename = 'roles';
  }

  class User extends Model {
    static basename = 'user';

    get company() {
      return this.belongsTo(Company);
    }

    get role() {
      return this.belongsTo(Role);
    }
  }

  const axiosAdapter = new MockAdapter(Company.api.http);

  afterEach(() => {
    axiosAdapter.reset();
  });

  it('fetches model', async () => {
    axiosAdapter.onGet('companies/10').reply(200, { id: 10, name: 'Business A' });
    axiosAdapter.onGet('roles/20').reply(200, { id: 20, name: 'Admin' });

    const user = new User().set({ company_id: 10, role_id: 20 });
    const company = await user.company.fetch();
    const role = await user.role.fetch();

    expect(company).toBeInstanceOf(Company);
    expect(() => user.company.data).toThrowError();
    expect(company).toEqual({
      id: 10,
      name: 'business a'
    });

    expect(role).toBeInstanceOf(Role);
    expect(() => user.role.data).toThrowError();
    expect(role).toEqual({
      id: 20,
      name: 'Admin'
    });
  });

  it('loads model', async () => {});

  it('creates foreign dependency', async () => {
    axiosAdapter
      .onPost('users/1/companies', { name: 'Brand New Business' })
      .reply(200, { id: 10, name: 'Brand New Business' });

    const user = new User().set({ id: 1 });
    const company = await user.company.create({ name: 'Brand New Business' }).fetch();

    expect(user.company.data).toBe(company);
    expect(company).toBeInstanceOf(Company);
    expect(company).toEqual({
      id: 10,
      name: 'brand new business'
    });
  });
});
