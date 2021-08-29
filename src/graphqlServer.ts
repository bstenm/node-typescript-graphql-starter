import { UserResolver } from './resolver/User.resolver';
import { Server } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { Application } from 'express';
import { buildSchema } from 'type-graphql';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { config } from './config';

export const graphqlServer = async (app: Application, httpServer: Server) => {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    pubSub: new RedisPubSub({
      publisher: new Redis(config.redis),
      subscriber: new Redis(config.redis),
    }),
  });

  // The apollo server as express server
  const apolloServer = new ApolloServer({ schema });
  // As of apollo v3 it is asynchroneous
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  /*
    Wraps the http server so that we can serve 
    the subscriptions over a Websocket protocol
   (https://github.com/apollographql/subscriptions-transport-ws/blob/master/PROTOCOL.md)
  */
  const subscriptionServer = new SubscriptionServer(
    { execute, subscribe, schema },
    { server: httpServer }
  );

  return { apolloServer, subscriptionServer };
};
