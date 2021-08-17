import { ApolloServer, gql } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
// For typegraphql type refelction to work (https://typegraphql.com/docs/installation.html)
import 'reflect-metadata';
import { User } from './entity/User';
import { Orm } from './orm';

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    username: String
  }
  type Query {
    user(id: ID!): User!
    hello(name: String!): String!
  }
  type Mutation {
    createUser(email: String!, username: String): User
  }
`;

const resolvers = {
  Query: {
    hello: (_: any, { name }: { name: string }) => `Yo ${name}!`,
  },

  Mutation: {
    createUser: (
      _: any,
      { username, email }: { username: string; email: string }
    ) => {
      const user = new User();
      user.email = email;
      user.username = username;
      return Orm.addUser(user);
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export { apolloServer };
