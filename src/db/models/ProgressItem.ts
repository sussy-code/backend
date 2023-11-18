import { Entity, PrimaryKey, Property, Unique, types } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { z } from 'zod';

export const progressMetaSchema = z.object({
  title: z.string(),
  year: z.number(),
  poster: z.string().optional(),
  type: z.union([z.literal('show'), z.literal('movie')]),
});

export type ProgressMeta = z.infer<typeof progressMetaSchema>;

@Entity({ tableName: 'progress_items' })
@Unique({ properties: ['tmdbId', 'userId', 'seasonId', 'episodeId'] })
export class ProgressItem {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id: string = randomUUID();

  @Property({ name: 'tmdb_id' })
  tmdbId!: string;

  @Property({ name: 'user_id' })
  userId!: string;

  @Property({ name: 'season_id', nullable: true })
  seasonId?: string;

  @Property({ name: 'episode_id', nullable: true })
  episodeId?: string;

  @Property({ name: 'season_number', nullable: true })
  seasonNumber?: number;

  @Property({ name: 'episode_number', nullable: true })
  episodeNumber?: number;

  @Property({
    name: 'meta',
    type: types.json,
  })
  meta!: ProgressMeta;

  @Property({ name: 'updated_at', type: 'date' })
  updatedAt!: Date;

  /* progress */
  @Property({ name: 'duration', type: 'bigint' })
  duration!: number;

  @Property({ name: 'watched', type: 'bigint' })
  watched!: number;
}

export interface ProgressItemDTO {
  id: string;
  tmdbId: string;
  season: {
    id?: string;
    number?: number;
  };
  episode: {
    id?: string;
    number?: number;
  };
  meta: {
    title: string;
    year: number;
    poster?: string;
    type: string;
  };
  duration: number;
  watched: number;
  updatedAt: string;
}

export function formatProgressItem(
  progressItem: ProgressItem,
): ProgressItemDTO {
  return {
    id: progressItem.id,
    tmdbId: progressItem.tmdbId,
    episode: {
      id: progressItem.episodeId,
      number: progressItem.episodeNumber,
    },
    season: {
      id: progressItem.seasonId,
      number: progressItem.seasonNumber,
    },
    meta: {
      title: progressItem.meta.title,
      year: progressItem.meta.year,
      poster: progressItem.meta.poster,
      type: progressItem.meta.type,
    },
    duration: progressItem.duration,
    watched: progressItem.watched,
    updatedAt: progressItem.updatedAt.toISOString(),
  };
}
