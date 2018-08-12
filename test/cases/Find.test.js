import MockAdapter from 'axios-mock-adapter';
import Model from '../../src/Model';

describe('Find', () => {
  class User extends Model {
    static basename = 'user';
  }

  const axiosAdapter = new MockAdapter(User.api.http);

  afterEach(() => {
    axiosAdapter.reset();
  });

  it('finds a Model', async () => {
    axiosAdapter.onGet('users/1').reply(200, { id: 1, name: 'John Doe' });

    const user = await User.find(1);
    expect(user instanceof User).toBeTruthy();
    expect(user.id).toEqual(1);
    expect(user.name).toEqual('John Doe');
  });
});
