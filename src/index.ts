import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { createConnection } from 'typeorm';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import express, { Application } from 'express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import config from './config';
import { log } from './logger';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';

const { host, port } = config.server;

const schema = makeExecutableSchema({ typeDefs, resolvers });

(async () => {
  try {
    const app: Application = express();
    const httpServer = createServer(app);
    const apolloServer = new ApolloServer({ schema });
    // As of apollo v3 it is asynchroneous
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    const { graphqlPath } = apolloServer;
    // The subscription server operating the Graphql over Websocket protocol
    // (https://github.com/apollographql/subscriptions-transport-ws/blob/master/PROTOCOL.md)
    new SubscriptionServer(
      { execute, subscribe, schema },
      { server: httpServer, path: graphqlPath }
    );
    // Start the typeorm connection as defined by the
    // corresponding config file (see ormconfig.json)
    await createConnection();
    // Start the server
    httpServer.listen({ port, host }, () => {
      log.info('server.start.success');
      console.log(
        `🚀 Query/Mutation endpoint ready at http://${host}:${port}${graphqlPath}`
      );
      console.log(
        `🚀 Subscription endpoint ready at ws://${host}:${port}${graphqlPath}`
      );
    });
  } catch (e) {
    log.error(`db.connection.error: ${e}`);
  }
})();
