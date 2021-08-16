import { apolloServer } from '../src/graphqlServer';
import { Orm } from './orm';

describe('Graphql resolvers', () => {
  it('Returns greeting', async () => {
    const result = await apolloServer.executeOperation({
      query: '{ hello(name: "Bro") }',
    });
    expect(result.data?.hello).toBe('Yo Bro!');
  });

  it('Adds a user to the database', async () => {
    const addUserMock = jest.spyOn(Orm, 'addUser');
    await apolloServer.executeOperation({
      query: `mutation {
        createUser(email: "machin@bidule.com", username: "YoBro"){
          id
          email
          username
        }
      }`,
    });
    expect(addUserMock).toHaveBeenCalledTimes(1);
    expect(addUserMock).toHaveBeenCalledWith({
      email: 'machin@bidule.com',
      username: 'YoBro',
    });
  });
});
