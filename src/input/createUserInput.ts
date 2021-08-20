import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email!: string;

  @Field()
  username!: string;
}
