import { Migration } from '@mikro-orm/migrations';

export class Migration20231105150807 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "progress_items" add column "season_number" int null, add column "episode_number" int null;',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "progress_items" drop column "season_number";');
    this.addSql('alter table "progress_items" drop column "episode_number";');
  }
}
