import { createConnection } from 'typeorm';
import config from './config';
import { apolloServer, app } from './graphqlServer';
import { log } from './logger';

const { host, port } = config.server;

createConnection()
  .then(() => {
    app.listen({ port, host }, () => {
      log.info('server.start.success');
      console.log(
        `🚀 Server ready at http://${host}:${port}${apolloServer.graphqlPath}`
      );
    });
  })
  .catch((e) => {
    log.error(`db.connection.error: ${e}`);
  });
