import { Entity, PrimaryKey, Property, Unique, types } from '@mikro-orm/core';
import { z } from 'zod';

export const bookmarkMetaSchema = z.object({
  title: z.string(),
  year: z.number(),
  poster: z.string().optional(),
  type: z.string(),
});

export type BookmarkMeta = z.infer<typeof bookmarkMetaSchema>;

@Entity({ tableName: 'bookmarks' })
@Unique({ properties: ['tmdbId', 'userId'] })
export class Bookmark {
  @PrimaryKey({ name: 'tmdb_id' })
  tmdbId!: string;

  @PrimaryKey({ name: 'user_id' })
  userId!: string;

  @Property({
    name: 'meta',
    type: types.json,
  })
  meta!: BookmarkMeta;

  @Property({ name: 'updated_at', type: 'date' })
  updatedAt!: Date;
}

export interface BookmarkDTO {
  tmdbId: string;
  meta: {
    title: string;
    year: number;
    poster?: string;
    type: string;
  };
  updatedAt: string;
}

export function formatBookmark(bookmark: Bookmark): BookmarkDTO {
  return {
    tmdbId: bookmark.tmdbId,
    meta: {
      title: bookmark.meta.title,
      year: bookmark.meta.year,
      poster: bookmark.meta.poster,
      type: bookmark.meta.type,
    },
    updatedAt: bookmark.updatedAt.toISOString(),
  };
}
