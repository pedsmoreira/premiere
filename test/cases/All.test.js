import MockAdapter from 'axios-mock-adapter';
import Model from '../../src/Model';

describe('All', () => {
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

  it('finds all models', async () => {
    axiosAdapter.onGet('users').reply(200, [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }]);

    const users = await User.all;
    expect(users.length).toEqual(2);
    expect(users[0]).toBeInstanceOf(User);

    expect(users).toEqual([{ id: 1, name: 'john doe' }, { id: 2, name: 'jane doe' }]);
  });
});
