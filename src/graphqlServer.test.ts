import { ApolloServer } from 'apollo-server-express';
import express, { Application } from 'express';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { graphqlServer } from '../src/graphqlServer';
import { User } from './entity/User';
import { Orm } from './orm';

const someId = '12345';
const someEmail = 'machin@bidule.com';
const someUsername = 'YoBro';

const user = new User();
user.email = someEmail;
user.username = someUsername;

describe('Graphql resolvers', () => {
  let apolloServer: ApolloServer;
  let subscriptionServer: SubscriptionServer;

  beforeAll(async () => {
    const app: Application = express();
    const httpServer = createServer(app);
    const instance = await graphqlServer(app, httpServer);
    apolloServer = instance.apolloServer;
    subscriptionServer = instance.subscriptionServer;
  });

  afterAll(async () => {
    apolloServer.stop();
    subscriptionServer.close();
  });

  it('Returns greeting', async () => {
    const result = await apolloServer.executeOperation({
      query: '{ hello }',
    });
    expect(result.data?.hello).toBe('Yo Bro!');
  });

  it('Adds a user to the database', async () => {
    const addUserMock = jest.spyOn(Orm, 'addUser');
    addUserMock.mockReturnValue(
      new Promise((resolve) => {
        user.id = someId;
        resolve(user);
      })
    );
    const result = await apolloServer.executeOperation({
      query: `mutation {
        createUser(data: {email: "machin@bidule.com", username: "YoBro"}){
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
    expect(result.data?.createUser.username).toBe(someUsername);
    expect(result.data?.createUser.email).toBe(someEmail);
    expect(result.data?.createUser.id).toBe(someId);
  });
});
