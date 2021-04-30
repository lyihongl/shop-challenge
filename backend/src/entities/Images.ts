import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 } from "uuid";
import { User } from "./User";

@Entity()
@ObjectType()
export class MyImage {
  @Field(() => String)
  @PrimaryKey()
  id: string = v4();

  @Field(() => User)
  @ManyToOne(() => User)
  userid!: User;

  @Field(() => String)
  @Property({ columnType: "varchar(255)" })
  title!: string;

  @Field(() => String)
  @Property({ type: "text" })
  desc?: string;

  // stores the aws s3 path
  @Field(() => String)
  @Property()
  path!: string;

  @Field()
  @Property()
  isPrivate: boolean;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Property()
  awsKey!: string;
}
