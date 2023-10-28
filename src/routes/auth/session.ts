import { Session } from '@/db/models/Session';
import { StatusError } from '@/services/error';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';

export const sessionRouter = makeRouter((app) => {
  app.delete(
    '/auth/session/:sid',
    {
      schema: {
        params: z.object({
          sid: z.string(),
        }),
      },
    },
    handle(async ({ auth, params, em }) => {
      auth.assert();

      const targetedSession = await em.findOne(Session, { id: params.sid });
      if (!targetedSession) return true; // already deleted

      if (targetedSession.user !== auth.user.id)
        throw new StatusError('Cant delete sessions you dont own', 401);

      await em.removeAndFlush(targetedSession);
      return true;
    }),
  );
});
