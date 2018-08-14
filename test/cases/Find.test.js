import MockAdapter from 'axios-mock-adapter';
import Model from '../../src/Model';

describe('Find', () => {
  class User extends Model {
    static basename = 'user';

    normalizeName(name) {
      return name.toLowerCase();
    }
  }

  const axiosAdapter = new MockAdapter(User.api.http);

  afterEach(() => {
    axiosAdapter.reset();
  });

  it('finds a model', async () => {
    axiosAdapter.onGet('users/1').reply(200, { id: 1, name: 'John Doe' });

    const user = await User.find(1).fetch();
    expect(user).toBeInstanceOf(User);

    expect(user).toEqual({
      id: 1,
      name: 'john doe'
    });
  });
});
