import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 } from "uuid";

@Entity()
@ObjectType()
export class User {
  @Field(() => String)
  @PrimaryKey()
  id: string = v4();

  @Field()
  @Property({ unique: true })
  username!: string;

  @Property()
  password!: string;
}
