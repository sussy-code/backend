import { Migration } from '@mikro-orm/migrations';

export class Migration20231221185725 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "provider_metrics" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table "provider_metrics" ("id" uuid not null default null, "tmdb_id" varchar not null default null, "type" varchar not null default null, "title" varchar not null default null, "season_id" varchar null default null, "episode_id" varchar null default null, "created_at" timestamptz not null default null, "status" varchar not null default null, "provider_id" varchar not null default null, "embed_id" varchar null default null, "error_message" text null default null, "full_error" text null default null, "hostname" varchar not null default null, constraint "provider_metrics_pkey" primary key ("id"));');
  }

}
