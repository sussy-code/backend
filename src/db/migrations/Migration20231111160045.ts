import { Migration } from '@mikro-orm/migrations';

export class Migration20231111160045 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "provider_metrics" add column "hostname" varchar(255) not null;',
    );
    this.addSql(
      'alter table "provider_metrics" alter column "error_message" type text using ("error_message"::text);',
    );
    this.addSql(
      'alter table "provider_metrics" alter column "full_error" type text using ("full_error"::text);',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "provider_metrics" alter column "error_message" type varchar(255) using ("error_message"::varchar(255));',
    );
    this.addSql(
      'alter table "provider_metrics" alter column "full_error" type varchar(255) using ("full_error"::varchar(255));',
    );
    this.addSql('alter table "provider_metrics" drop column "hostname";');
  }
}
