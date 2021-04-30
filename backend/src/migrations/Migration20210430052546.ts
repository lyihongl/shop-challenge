import { Migration } from '@mikro-orm/migrations';

export class Migration20210430052546 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "my_image" add column "aws_key" varchar(255) not null;');
  }

}
