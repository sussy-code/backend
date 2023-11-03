import { User, formatUser } from '@/db/models/User';
import { StatusError } from '@/services/error';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';

export const userEditRouter = makeRouter((app) => {
  app.patch(
    '/users/:uid',
    {
      schema: {
        params: z.object({
          uid: z.string(),
        }),
        body: z.object({
          profile: z
            .object({
              colorA: z.string(),
              colorB: z.string(),
              icon: z.string(),
            })
            .optional(),
          name: z.string().max(500).min(1).optional(),
        }),
      },
    },
    handle(async ({ auth, params, body, em }) => {
      await auth.assert();

      const user = await em.findOne(User, { id: params.uid });
      if (!user) throw new StatusError('User does not exist', 404);

      if (auth.user.id !== user.id)
        throw new StatusError('Cannot modify user other than yourself', 403);

      if (body.profile) user.profile = body.profile;

      await em.persistAndFlush(user);
      return formatUser(user);
    }),
  );
});
