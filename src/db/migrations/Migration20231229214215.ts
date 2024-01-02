import { Migration } from '@mikro-orm/migrations';

export class Migration20231229214215 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user_settings" add column "proxy_urls" text[] null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user_settings" drop column "proxy_urls";');
  }

}
