/*
 * Set up the graphql client that will enable us
 *  to send requests to the graphql server using
 * a hybrid approach: http for queries/mutations
 * and websocket for subscriptions
 */

import { WebSocketLink } from '@apollo/client/link/ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import config from './config';

const { host, port, path } = config.server;
const endPoint = `${host}:${port}/${path}`;

// We will use the http protocol for queries and mutations
const httpLink = new HttpLink({
  uri: `http://${endPoint}`,
});

// We will use the websocket protocol for subscriptions
const wsLink = new WebSocketLink({
  uri: `ws://${endPoint}`,
  options: {
    reconnect: true,
  },
});

/*
 * We use the websocket link forsubscriptions and the http
 * endpoint for all other operations (queries and mutations).
 * We could use a websocket for all operations but  queries
 * and mutations don't require a stateful or  long-lasting
 *connection thus making HTTP more efficient and scalable
 */
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

// The graphql client that can perform
// queries/mutations/subscriptions
const graphqlClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export { graphqlClient };
