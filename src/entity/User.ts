import 'reflect-metadata';
import { Field, ID, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @Column('varchar', { length: 255 })
  email!: string;

  @Field(() => String)
  @Column('text', { nullable: true })
  username!: string;

  @BeforeInsert()
  addId() {
    this.id = uuidv4();
  }
}
