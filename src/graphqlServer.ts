import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import express, { Application } from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

export const graphqlServer = async () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const app: Application = express();
  const httpServer = createServer(app);
  const apolloServer = new ApolloServer({ schema });
  // As of apollo v3 it is asynchroneous
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  const path = apolloServer.graphqlPath;
  // TWraps the http server so that we can serve the subscriptions over a Websocket protocol
  // (https://github.com/apollographql/subscriptions-transport-ws/blob/master/PROTOCOL.md)
  new SubscriptionServer(
    { execute, subscribe, schema },
    { server: httpServer, path }
  );
  return { httpServer, path };
};
