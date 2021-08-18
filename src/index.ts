import { createConnection } from 'typeorm';
import config from './config';
import { log } from './logger';
import { graphqlServer } from './graphqlServer';
// @ts-ignore
import { graphqlClient } from './graphqlClient';
// @ts-ignore
import { gql } from 'apollo-server-express';

// ===============================================================
const { execute } = require('apollo-link');
const { WebSocketLink } = require('apollo-link-ws');
const { SubscriptionClient } = require('subscriptions-transport-ws');
const ws = require('ws');

// @ts-ignore
const getWsClient = function (wsurl: any) {
  const client = new SubscriptionClient(wsurl, { reconnect: true }, ws);
  return client;
};

// @ts-ignore
const createSubscriptionObservable = (
  wsurl: any,
  query: any,
  variables: any
) => {
  const link = new WebSocketLink(getWsClient(wsurl));
  return execute(link, { query: query, variables: variables });
};

// A subscription query to get changes for author with parametrised id
// using $id as a query variable
// @ts-ignore
const SUBSCRIBE_QUERY = gql`
  subscription {
    userAdded {
      email
      id
      username
    }
  }
`;

const { host, port, path } = config.server;

const endPoint = `${host}:${port}${path}`;
`ws://${endPoint}`;

// @ts-ignore
const subscriptionClient = createSubscriptionObservable(
  `ws://${endPoint}`, // GraphQL endpoint
  SUBSCRIBE_QUERY, // Subscription query
  { id: 1 } // Query variables
);

// ===============================================================

// const { host, port } = config.server;

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

      subscriptionClient.subscribe(
        (eventData: any) => {
          // Do something on receipt of the event
          console.log('Received event: ');
          console.log(JSON.stringify(eventData, null, 2));
        },
        (err: any) => {
          console.log('Err');
          console.log(err);
        }
      );
      // (async () => {
      //   const result = await graphqlClient.query({
      //     query: gql`
      //       query {
      //         hello
      //       }
      //     `,
      //   });
      //   console.log('THE VALUE >>', result.data);
      // })();
      // setTimeout(() => {

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
