import { Session, formatSession } from '@/db/models/Session';
import { StatusError } from '@/services/error';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';

export const sessionRouter = makeRouter((app) => {
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

  app.patch(
    '/sessions/:sid',
    {
      schema: {
        params: z.object({
          sid: z.string(),
        }),
        body: z.object({
          name: z.string().min(1).optional(),
        }),
      },
    },
    handle(async ({ auth, params, body, em }) => {
      await auth.assert();

      const targetedSession = await em.findOne(Session, { id: params.sid });
      if (!targetedSession) throw new StatusError('Not found', 404);
      if (targetedSession.id !== params.sid)
        throw new StatusError('Cannot edit sessions other than your own', 401);

      if (body.name) targetedSession.device = body.name;

      await em.persistAndFlush(targetedSession);

      return formatSession(targetedSession);
    }),
  );
});
