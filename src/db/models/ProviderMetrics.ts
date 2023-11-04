import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { randomUUID } from 'crypto';

export const status = {
  failed: 'failed',
  notfound: 'notfound',
  success: 'success',
} as const;
type Status = keyof typeof status;

@Entity({ tableName: 'provider_metrics' })
export class ProviderMetric {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id: string = randomUUID();

  @Property({ name: 'tmdb_id' })
  tmdbId!: string;

  @Property({ name: 'type' })
  type!: string;

  @Property({ name: 'title' })
  title!: string;

  @Property({ name: 'season_id', nullable: true })
  seasonId?: string;

  @Property({ name: 'episode_id', nullable: true })
  episodeId?: string;

  @Property({ name: 'created_at', type: 'date' })
  createdAt = new Date();

  @Property({ name: 'status' })
  status!: Status;

  @Property({ name: 'provider_id' })
  providerId!: string;

  @Property({ name: 'embed_id', nullable: true })
  embedId?: string;

  @Property({ name: 'error_message', nullable: true })
  errorMessage?: string;

  @Property({ name: 'full_error', nullable: true })
  fullError?: string;
}
