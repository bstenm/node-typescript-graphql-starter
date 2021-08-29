import { createConnection } from 'typeorm';
import { log } from './logger';
import { config } from './config';
import { graphqlServer } from './graphqlServer';
import express, { Application } from 'express';
import { createServer } from 'http';

(async () => {
  try {
    const { endPoint, server } = config;
    const { port, host } = server;

    const app: Application = express();
    const httpServer = createServer(app);
    /*
     * Get the graphql server that resolves queries and
     * mutations over http and subscriptions over websocket
     * also get the path on whichit can be accessed
     */
    const { subscriptionServer } = await graphqlServer(app, httpServer);

    /*
     * Start the typeorm connection as defined by the
     * corresponding config file (see ormconfig.json)
     */
    await createConnection();
    // Start the server
    httpServer.listen({ port, host }, async () => {
      log.info('server.start.success');
      console.log(`🚀 Query/Mutation endpoint ready at ${endPoint.http}`);
      console.log(`🚀 Subscription endpoint ready at ${endPoint.ws}`);
    });

    /*
    Shut down in the case of interrupt and termination signals
    We expect to handle this more cleanly in the future.
    https://github.com/apollographql/apollo-server/issues/5074
    */
    ['SIGINT', 'SIGTERM'].forEach((signal) => {
      process.on(signal, () => subscriptionServer.close());
    });
  } catch (e) {
    log.error(`db.connection.error: ${e}`);
  }
})();
