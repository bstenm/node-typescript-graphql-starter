import { gql } from 'apollo-server-express';

export const typeDefs = gql`
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
  type Subscription {
    userAdded: User!
  }
`;
