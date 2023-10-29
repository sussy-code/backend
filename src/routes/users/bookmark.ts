import {
  Bookmark,
  bookmarkMetaSchema,
  formatBookmark,
} from '@/db/models/Bookmark';
import { StatusError } from '@/services/error';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';

export const userBookmarkRouter = makeRouter((app) => {
  app.get(
    '/users/:uid/bookmarks',
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
        throw new StatusError('Cannot access other user information', 403);

      const bookmarks = await em.find(Bookmark, {
        userId: params.uid,
      });

      return bookmarks.map(formatBookmark);
    }),
  );

  app.post(
    '/users/:uid/bookmarks/:tmdbid',
    {
      schema: {
        params: z.object({
          uid: z.string(),
          tmdbid: z.string(),
        }),
        body: z.object({
          meta: bookmarkMetaSchema,
        }),
      },
    },
    handle(async ({ auth, params, body, em }) => {
      await auth.assert();

      if (auth.user.id !== params.uid)
        throw new StatusError('Cannot modify user other than yourself', 403);

      const oldBookmark = await em.findOne(Bookmark, {
        userId: params.uid,
        tmdbId: params.tmdbid,
      });
      if (oldBookmark) throw new StatusError('Already bookmarked', 400);

      const bookmark = new Bookmark();
      em.assign(bookmark, {
        userId: params.uid,
        tmdbId: params.tmdbid,
        meta: body.meta,
        updatedAt: new Date(),
      });

      await em.persistAndFlush(bookmark);
      return formatBookmark(bookmark);
    }),
  );

  app.delete(
    '/users/:uid/bookmarks/:tmdbid',
    {
      schema: {
        params: z.object({
          uid: z.string(),
          tmdbid: z.string(),
        }),
      },
    },
    handle(async ({ auth, params, em }) => {
      await auth.assert();

      if (auth.user.id !== params.uid)
        throw new StatusError('Cannot modify user other than yourself', 403);

      const bookmark = await em.findOne(Bookmark, {
        userId: params.uid,
        tmdbId: params.tmdbid,
      });

      if (!bookmark) return { tmdbId: params.tmdbid };

      await em.removeAndFlush(bookmark);
      return { tmdbId: params.tmdbid };
    }),
  );
});
