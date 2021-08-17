import express, { Application } from 'express';
import { createConnection } from 'typeorm';
import config from './config';
import { apolloServer } from './graphqlServer';
import { log } from './logger';

const { host, port } = config.server;

async function startServer() {
  try {
    const app: Application = express();
    // As of apollo v3 it is asynchroneous
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    // Start the typeorm connection (see ormconfig.json)
    await createConnection();
    // Start the http graphql server
    app.listen({ port, host }, () => {
      log.info('server.start.success');
      console.log(
        `🚀 Server ready at http://${host}:${port}${apolloServer.graphqlPath}`
      );
    });
  } catch (e) {
    log.error(`db.connection.error: ${e}`);
  }
}

startServer();
