import { Session, formatSession } from '@/db/models/Session';
import { StatusError } from '@/services/error';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';

export const userSessionsRouter = makeRouter((app) => {
  app.get(
    '/users/:uid/sessions',
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

      const sessions = await em.find(Session, {
        user: params.uid,
      });

      return sessions.map(formatSession);
    }),
  );
});
