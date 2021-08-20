import { User } from './../entity/User';
import { Publisher } from 'type-graphql';
import {
  Arg,
  Mutation,
  PubSub,
  Query,
  Resolver,
  Root,
  Subscription,
} from 'type-graphql/dist/decorators';
import { CreateUserInput } from '../input/createUserInput';
import { Orm } from '../orm';

const ADDED_USER = 'addedUser';

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return `Yo Bro!`;
  }

  @Mutation(() => User)
  async createUser(
    @Arg('data') data: CreateUserInput,
    @PubSub(ADDED_USER) notify: Publisher<User>
  ) {
    const user = new User();
    user.email = data.email;
    user.username = data.username;
    const newUser = await Orm.addUser(user);
    notify(newUser);
    return newUser;
  }

  @Subscription(() => String, { topics: ADDED_USER })
  userAdded(@Root() newUser: User): string {
    return newUser.id;
  }
}
