import { createConnection } from 'typeorm';
import { log } from './logger';
import config from './config';
import { graphqlServer } from './graphqlServer';

(async () => {
  try {
    /*
     * Get the graphql server that resolves queries and
     * mutations over http and subscriptions over websocket
     * also get the path on whichit can be accessed
     */
    const { httpServer } = await graphqlServer();

    const { endPoint, server } = config;
    const { port, host } = server;
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
  } catch (e) {
    log.error(`db.connection.error: ${e}`);
  }
})();
