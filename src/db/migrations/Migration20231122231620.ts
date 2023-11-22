import { Migration } from '@mikro-orm/migrations';

export class Migration20231122231620 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_settings" alter column "id" type text using ("id"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_settings" alter column "id" drop default;');
    this.addSql('alter table "user_settings" alter column "id" type uuid using ("id"::text::uuid);');
  }

}
