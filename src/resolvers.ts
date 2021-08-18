import { PubSub } from 'graphql-subscriptions';
import { User } from './entity/User';
import { Orm } from './orm';

const ADDED_USER = 'addedUser';

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    hello: () => `Yo Bro!`,
  },

  Mutation: {
    createUser: async (
      _: any,
      { username, email }: { username: string; email: string }
    ) => {
      const user = new User();
      user.email = email;
      user.username = username;
      const newUser = await Orm.addUser(user);
      pubsub.publish(ADDED_USER, { userAdded: newUser });
      return newUser;
    },
  },

  Subscription: {
    userAdded: {
      subscribe: () => pubsub.asyncIterator(ADDED_USER),
    },
  },
};
