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

  it('finds a model', async () => {
    axiosAdapter.onGet('companies/10').reply(200, { id: 10, name: 'Business A' });
    axiosAdapter.onGet('roles/20').reply(200, { id: 20, name: 'Admin' });

    const user = new User().set({ company_id: 10, role_id: 20 });
    await user.company.fetch();
    await user.role.fetch();

    expect(user.company.data).toBeInstanceOf(Company);

    expect(user.company.data).toEqual({
      id: 10,
      name: 'business a'
    });

    expect(user.role.data).toEqual({
      id: 20,
      name: 'Admin'
    });
  });
});
