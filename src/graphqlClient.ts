/*
 Set up the graphql client that can send requests to
 the graphql server using a hybrid approach: http for
 queries/mutations and websocket for subscriptions
 */

import ws from 'ws';
import { HttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import config from './config';
// The apollo client expect an implementation of "fetch" available globally
import 'cross-fetch/polyfill';

const { endPoint } = config;

const subscriptionClient = new SubscriptionClient(
  endPoint.ws,
  { reconnect: true },
  ws
);

const wsLink = new WebSocketLink(subscriptionClient);
const httpLink = new HttpLink({ uri: endPoint.http });

/*
 We use a websocket protocol for subscriptions and a http
 protocol for all other operations (queries and mutations).
 We could use a websocket for all operations but  queries
 and mutations do not require a stateful or  long-lasting
 connection thus making HTTP more efficient and scalable
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

/*
 The graphql client can now perform queries/mutations
 over http and listen to mutations over a websocket
 */
const graphqlClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export { graphqlClient };
