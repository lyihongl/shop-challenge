import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";
import { v4 } from "uuid";
import { MyImage } from "./Images";
import { User } from "./User";

@Entity()
@ObjectType()
export class MyTag {
  @Field(() => String)
  @PrimaryKey()
  id: string = v4();

  @Field(() => User)
  @ManyToOne(() => User)
  userid!: User;

  @Field(() => MyImage)
  @ManyToOne(() => MyImage, { onDelete: "cascade" })
  imageid!: MyImage;

  @Field(() => String)
  @Property({ columnType: "varchar(255)" })
  tag!: string;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();
}
