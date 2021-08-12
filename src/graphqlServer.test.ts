import { apolloServer } from './graphqlServer';

describe('Graphql resolvers', () => {
  it('Returns greeting', async () => {
    const result = await apolloServer.executeOperation({
      query: '{ hello }',
    });
    expect(result.data?.hello).toBe('Yo!');
  });
});
