import { Migration } from '@mikro-orm/migrations';

export class Migration20231104150702 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "bookmarks" ("tmdb_id" varchar(255) not null, "user_id" varchar(255) not null, "meta" jsonb not null, "updated_at" timestamptz(0) not null, constraint "bookmarks_pkey" primary key ("tmdb_id", "user_id"));',
    );
    this.addSql(
      'alter table "bookmarks" add constraint "bookmarks_tmdb_id_user_id_unique" unique ("tmdb_id", "user_id");',
    );

    this.addSql(
      'create table "challenge_codes" ("code" uuid not null, "flow" text not null, "auth_type" varchar(255) not null, "created_at" timestamptz(0) not null, "expires_at" timestamptz(0) not null, constraint "challenge_codes_pkey" primary key ("code"));',
    );

    this.addSql(
      'create table "progress_items" ("id" uuid not null, "tmdb_id" varchar(255) not null, "user_id" varchar(255) not null, "season_id" varchar(255) null, "episode_id" varchar(255) null, "meta" jsonb not null, "updated_at" timestamptz(0) not null, "duration" bigint not null, "watched" bigint not null, constraint "progress_items_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "progress_items" add constraint "progress_items_tmdb_id_user_id_season_id_episode_id_unique" unique ("tmdb_id", "user_id", "season_id", "episode_id");',
    );

    this.addSql(
      'create table "provider_metrics" ("id" uuid not null, "tmdb_id" varchar(255) not null, "type" varchar(255) not null, "title" varchar(255) not null, "season_id" varchar(255) null, "episode_id" varchar(255) null, "created_at" timestamptz(0) not null, "status" varchar(255) not null, "provider_id" varchar(255) not null, "embed_id" varchar(255) null, "error_message" varchar(255) null, "full_error" varchar(255) null, constraint "provider_metrics_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "sessions" ("id" uuid not null, "user" text not null, "created_at" timestamptz(0) not null, "accessed_at" timestamptz(0) not null, "expires_at" timestamptz(0) not null, "device" text not null, "user_agent" text not null, constraint "sessions_pkey" primary key ("id"));',
    );

    this.addSql(
      'create table "users" ("id" text not null, "public_key" text not null, "namespace" varchar(255) not null, "created_at" timestamptz(0) not null, "last_logged_in" timestamptz(0) null, "permissions" text[] not null, "profile" jsonb not null, constraint "users_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "users" add constraint "users_public_key_unique" unique ("public_key");',
    );

    this.addSql(
      'create table "user_settings" ("id" uuid not null, "application_theme" varchar(255) null, "application_language" varchar(255) null, "default_subtitle_language" varchar(255) null, constraint "user_settings_pkey" primary key ("id"));',
    );
  }
}
