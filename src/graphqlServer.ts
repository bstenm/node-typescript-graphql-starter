import { UserResolver } from './resolver/User.resolver';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import express, { Application } from 'express';
import { buildSchema } from 'type-graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { config } from './config';

export const graphqlServer = async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    pubSub: new RedisPubSub({
      publisher: new Redis(config.redis),
      subscriber: new Redis(config.redis),
    }),
  });

  const app: Application = express();
  const httpServer = createServer(app);

  // The apollo server as express server
  const apolloServer = new ApolloServer({ schema });
  // As of apollo v3 it is asynchroneous
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  const path = apolloServer.graphqlPath;
  apolloServer.applyMiddleware({ app, path });

  /*
    Wraps the http server so that we can serve 
    the subscriptions over a Websocket protocol
   (https://github.com/apollographql/subscriptions-transport-ws/blob/master/PROTOCOL.md)
  */
  const subscriptionServer = new SubscriptionServer(
    { execute, subscribe, schema },
    { server: httpServer, path }
  );

  /*
    Shut down in the case of interrupt and termination signals
    We expect to handle this more cleanly in the future.
    https://github.com/apollographql/apollo-server/issues/5074
    */
  ['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => subscriptionServer.close());
  });
  return { httpServer, path };
};
