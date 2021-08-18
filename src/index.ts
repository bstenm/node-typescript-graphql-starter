import { createConnection } from 'typeorm';
import config from './config';
import { log } from './logger';
import { graphqlServer } from './graphqlServer';
// @ts-ignore
import { graphqlClient } from './graphqlClient';
// @ts-ignore
import { gql } from 'apollo-server-express';

const { host, port, path } = config.server;

(async () => {
  try {
    // Get the graphql server that resolves queries and
    // mutations over http and subscriptions over websocket
    // also get the path on whichit can be accessed
    const { httpServer } = await graphqlServer();
    const endPoint = `${host}:${port}/${path}`;
    // Start the typeorm connection as defined by the
    // corresponding config file (see ormconfig.json)
    await createConnection();
    // Start the server
    httpServer.listen({ port, host }, () => {
      log.info('server.start.success');
      console.log(`🚀 Query/Mutation endpoint ready at http://${endPoint}`);
      console.log(`🚀 Subscription endpoint ready at ws://${endPoint}`);

      // setTimeout(() => {
      // graphqlClient.query({
      //   query: gql`
      //     query ExampleQuery($helloName: String!) {
      //       hello(name: $helloName)
      //     }
      //   `,
      // });

      //   obs.subscribe({
      //     next(data) {
      //       console.log('Received>>', data);
      //     },
      //     error(e) {
      //       console.error('Error>>', e);
      //     },
      //     complete() {
      //       console.log('Graphql subscription is completed');
      //     },
      //   });
      // }, 5000);
    });
  } catch (e) {
    log.error(`db.connection.error: ${e}`);
  }
})();
