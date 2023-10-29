import {
  ProgressItem,
  formatProgressItem,
  progressMetaSchema,
} from '@/db/models/ProgressItem';
import { StatusError } from '@/services/error';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';

export const userProgressRouter = makeRouter((app) => {
  app.put(
    '/users/:uid/progress/:tmdbid',
    {
      schema: {
        params: z.object({
          uid: z.string(),
          tmdbid: z.string(),
        }),
        body: z.object({
          meta: progressMetaSchema,
          seasonId: z.string().optional(),
          episodeId: z.string().optional(),
          duration: z.number(),
          watched: z.number(),
        }),
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

      const progressItem = await em.findOne(ProgressItem, {
        userId: params.uid,
        tmdbId: params.tmdbid,
        episodeId: body.episodeId,
        seasonId: body.seasonId,
      });
      if (!progressItem) {
        return {
          tmdbId: params.tmdbid,
          episodeId: body.episodeId,
          seasonId: body.seasonId,
        };
      }

      await em.removeAndFlush(progressItem);
      return {
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
