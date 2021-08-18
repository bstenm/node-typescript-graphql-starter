import { createConnection } from 'typeorm';
import config from './config';
import { log } from './logger';
import { graphqlServer } from './graphqlServer';

const { host, port } = config.server;

(async () => {
  try {
    // Get the graphql server that resolves queries and
    // mutations over http and subscriptions over websocket
    // also get the path on whichit can be accessed
    const { httpServer, path } = await graphqlServer();
    const endPoint = `${host}:${port}${path}`;
    // Start the typeorm connection as defined by the
    // corresponding config file (see ormconfig.json)
    await createConnection();
    // Start the server
    httpServer.listen({ port, host }, () => {
      log.info('server.start.success');
      console.log(`🚀 Query/Mutation endpoint ready at http://${endPoint}`);
      console.log(`🚀 Subscription endpoint ready at ws://${endPoint}`);
    });
  } catch (e) {
    log.error(`db.connection.error: ${e}`);
  }
})();
