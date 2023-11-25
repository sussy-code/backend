import { Session, formatSession } from '@/db/models/Session';
import { StatusError } from '@/services/error';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';

export const sessionsRouter = makeRouter((app) => {
  app.patch(
    '/sessions/:sid',
    {
      schema: {
        params: z.object({
          sid: z.string(),
        }),
        body: z.object({
          deviceName: z.string().max(500).min(1).optional(),
        }),
      },
    },
    handle(async ({ auth, params, em, body }) => {
      await auth.assert();

      const targetedSession = await em.findOne(Session, { id: params.sid });

      if (!targetedSession)
        throw new StatusError('Session cannot be found', 404);

      if (targetedSession.id !== params.sid)
        throw new StatusError('Cannot edit sessions other than your own', 401);

      if (body.deviceName) targetedSession.device = body.deviceName;

      await em.persistAndFlush(targetedSession);

      return formatSession(targetedSession);
    }),
  );
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
