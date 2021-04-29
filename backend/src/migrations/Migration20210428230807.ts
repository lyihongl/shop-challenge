import { Migration } from '@mikro-orm/migrations';

export class Migration20210428230807 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "my_image" ("id" varchar(255) not null, "userid_id" varchar(255) not null, "title" varchar(255) not null, "desc" text not null, "path" varchar(255) not null, "created_at" timestamptz(0) not null);');
    this.addSql('alter table "my_image" add constraint "my_image_pkey" primary key ("id");');

    this.addSql('alter table "my_image" add constraint "my_image_userid_id_foreign" foreign key ("userid_id") references "user" ("id") on update cascade;');
  }

}
