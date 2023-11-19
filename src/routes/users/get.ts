import { formatSession } from '@/db/models/Session';
import { User, formatUser } from '@/db/models/User';
import { StatusError } from '@/services/error';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';

export const userGetRouter = makeRouter((app) => {
  app.get(
    '/users/@me',
    handle(async ({ auth, em }) => {
      await auth.assert();

      const user = await em.findOne(User, { id: auth.user.id });
      if (!user) throw new StatusError('User does not exist', 404);

      const session = await auth.getSession();
      if (!session) throw new StatusError('Session does not exist', 400);

      return {
        user: formatUser(user),
        session: formatSession(session),
      };
    }),
  );

  app.get(
    '/users/:uid',
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
        throw new StatusError('Cannot access users other than yourself', 403);

      const user = await em.findOne(User, { id: params.uid });
      if (!user) throw new StatusError('User does not exist', 404);

      return {
        user: formatUser(user),
      };
    }),
  );
});
