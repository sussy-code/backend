import { Session } from '@/db/models/Session';
import { StatusError } from '@/services/error';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';

export const authSessionRouter = makeRouter((app) => {
  app.delete(
    '/sessions/:sid',
    {
      schema: {
        params: z.object({
          sid: z.string(),
        }),
      },
    },
    handle(async ({ auth, params, em }) => {
      await auth.assert();

      const targetedSession = await em.findOne(Session, { id: params.sid });
      if (!targetedSession)
        return {
          id: params.sid,
        };

      if (targetedSession.user !== auth.user.id)
        throw new StatusError('Cannot delete sessions you do not own', 401);

      await em.removeAndFlush(targetedSession);
      return {
        id: params.sid,
      };
    }),
  );
});
