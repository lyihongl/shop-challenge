import { Migration } from '@mikro-orm/migrations';

export class Migration20210430025447 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "my_image" add column "is_private" bool not null;');
  }

}
