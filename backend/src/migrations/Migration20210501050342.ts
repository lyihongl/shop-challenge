import { Migration } from '@mikro-orm/migrations';

export class Migration20210501050342 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null);');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('create table "my_image" ("id" varchar(255) not null, "userid_id" varchar(255) not null, "title" varchar(255) not null, "desc" text not null, "path" varchar(255) not null, "is_private" bool not null, "created_at" timestamptz(0) not null, "aws_key" varchar(255) not null);');
    this.addSql('alter table "my_image" add constraint "my_image_pkey" primary key ("id");');

    this.addSql('create table "my_tag" ("id" varchar(255) not null, "userid_id" varchar(255) not null, "imageid_id" varchar(255) not null, "tag" varchar(255) not null, "created_at" timestamptz(0) not null);');
    this.addSql('alter table "my_tag" add constraint "my_tag_pkey" primary key ("id");');

    this.addSql('alter table "my_image" add constraint "my_image_userid_id_foreign" foreign key ("userid_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "my_tag" add constraint "my_tag_userid_id_foreign" foreign key ("userid_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "my_tag" add constraint "my_tag_imageid_id_foreign" foreign key ("imageid_id") references "my_image" ("id") on update cascade on delete cascade;');
  }

}
