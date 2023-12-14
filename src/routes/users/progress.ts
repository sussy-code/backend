import {
  ProgressItem,
  formatProgressItem,
  progressMetaSchema,
} from '@/db/models/ProgressItem';
import { StatusError } from '@/services/error';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { FilterQuery } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { z } from 'zod';

const progressItemSchema = z.object({
  meta: progressMetaSchema,
  tmdbId: z.string(),
  duration: z.number().transform((n) => Math.round(n)),
  watched: z.number().transform((n) => Math.round(n)),
  seasonId: z.string().optional(),
  episodeId: z.string().optional(),
  seasonNumber: z.number().optional(),
  episodeNumber: z.number().optional(),
  updatedAt: z.string().datetime({ offset: true }).optional(),
});

export const userProgressRouter = makeRouter((app) => {
  app.put(
    '/users/:uid/progress/:tmdbid',
    {
      schema: {
        params: z.object({
          uid: z.string(),
          tmdbid: z.string(),
        }),
        body: progressItemSchema,
      },
    },
    handle(async ({ auth, params, body, em }) => {
      await auth.assert();

      if (auth.user.id !== params.uid)
        throw new StatusError('Cannot modify user other than yourself', 403);

      let progressItem = await em.findOne(ProgressItem, {
        userId: params.uid,
        tmdbId: params.tmdbid,
        episodeId: body.episodeId,
        seasonId: body.seasonId,
      });

      if (!progressItem) {
        progressItem = new ProgressItem();
        progressItem.tmdbId = params.tmdbid;
        progressItem.userId = params.uid;
        progressItem.episodeId = body.episodeId;
        progressItem.seasonId = body.seasonId;
        progressItem.episodeNumber = body.episodeNumber;
        progressItem.seasonNumber = body.seasonNumber;
      }

      em.assign(progressItem, {
        duration: body.duration,
        watched: body.watched,
        meta: body.meta,
        updatedAt: new Date(),
      });

      await em.persistAndFlush(progressItem);
      return formatProgressItem(progressItem);
    }),
  );

  app.put(
    '/users/:uid/progress/import',
    {
      schema: {
        params: z.object({
          uid: z.string(),
        }),
        body: z.array(progressItemSchema),
      },
    },
    handle(async ({ auth, params, body, em, req, limiter }) => {
      await auth.assert();

      if (auth.user.id !== params.uid)
        throw new StatusError('Cannot modify user other than yourself', 403);

      const itemsUpserted: ProgressItem[] = [];

      const newItems = [...body];

      for (const existingItem of await em.find(ProgressItem, {
        userId: params.uid,
      })) {
        const newItemIndex = newItems.findIndex(
          (item) =>
            item.tmdbId == existingItem.tmdbId &&
            item.seasonId == existingItem.seasonId &&
            item.episodeId == existingItem.episodeId,
        );

        if (newItemIndex > -1) {
          const newItem = newItems[newItemIndex];
          if (existingItem.watched < newItem.watched) {
            existingItem.updatedAt = defaultAndCoerceDateTime(
              newItem.updatedAt,
            );
            existingItem.watched = newItem.watched;
          }
          itemsUpserted.push(existingItem);

          // Remove the item from the array, we have processed it
          newItems.splice(newItemIndex, 1);
        }
      }

      // All unprocessed items, aka all items that don't already exist
      for (const newItem of newItems) {
        itemsUpserted.push({
          id: randomUUID(),
          duration: newItem.duration,
          episodeId: newItem.episodeId,
          episodeNumber: newItem.episodeNumber,
          meta: newItem.meta,
          seasonId: newItem.seasonId,
          seasonNumber: newItem.seasonNumber,
          tmdbId: newItem.tmdbId,
          userId: params.uid,
          watched: newItem.watched,
          updatedAt: defaultAndCoerceDateTime(newItem.updatedAt),
        });
      }

      const progressItems = await em.upsertMany(ProgressItem, itemsUpserted);

      await em.flush();

      await limiter?.assertAndBump(req, {
        id: 'progress_import',
        max: 5,
        window: '10m',
      });

      return progressItems.map(formatProgressItem);
    }),
  );

  app.delete(
    '/users/:uid/progress/:tmdbid',
    {
      schema: {
        params: z.object({
          uid: z.string(),
          tmdbid: z.string(),
        }),
        body: z.object({
          seasonId: z.string().optional(),
          episodeId: z.string().optional(),
        }),
      },
    },
    handle(async ({ auth, params, body, em }) => {
      await auth.assert();

      if (auth.user.id !== params.uid)
        throw new StatusError('Cannot modify user other than yourself', 403);

      const query: FilterQuery<ProgressItem> = {
        userId: params.uid,
        tmdbId: params.tmdbid,
      };
      if (body.seasonId) query.seasonId = body.seasonId;
      if (body.episodeId) query.episodeId = body.episodeId;
      const progressItems = await em.find(ProgressItem, query);

      if (progressItems.length === 0) {
        return {
          count: 0,
          tmdbId: params.tmdbid,
          episodeId: body.episodeId,
          seasonId: body.seasonId,
        };
      }

      progressItems.forEach((v) => em.remove(v));
      await em.flush();

      return {
        count: progressItems.length,
        tmdbId: params.tmdbid,
        episodeId: body.episodeId,
        seasonId: body.seasonId,
      };
    }),
  );

  app.get(
    '/users/:uid/progress',
    {
      schema: {
        params: z.object({
          uid: z.string(),
        }),
      },
    },
    handle(async ({ auth, params, em }) => {
      await auth.assert();

      if (auth.user.id !== params.uid)
        throw new StatusError('Cannot modify user other than yourself', 403);

      const items = await em.find(ProgressItem, {
        userId: params.uid,
      });

      return items.map(formatProgressItem);
    }),
  );
});

// 13th July 2021 - movie-web epoch
const minEpoch = 1626134400000;

function defaultAndCoerceDateTime(dateTime: string | undefined) {
  const epoch = dateTime ? new Date(dateTime).getTime() : Date.now();

  const clampedEpoch = Math.max(minEpoch, Math.min(epoch, Date.now()));

  return new Date(clampedEpoch);
}
