import { formatSession } from '@/db/models/Session';
import { User } from '@/db/models/User';
import { StatusError } from '@/services/error';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { makeSession, makeSessionToken } from '@/services/session';
import { z } from 'zod';

const loginSchema = z.object({
  id: z.string(),
  device: z.string().max(500).min(1),
});

export const loginAuthRouter = makeRouter((app) => {
  app.post(
    '/auth/login',
    { schema: { body: loginSchema } },
    handle(async ({ em, body, req }) => {
      const user = await em.findOne(User, { id: body.id });

      if (user == null) {
        throw new StatusError('User cannot be found', 401);
      }

      const session = makeSession(
        user.id,
        body.device,
        req.headers['user-agent'],
      );

      await em.persistAndFlush(session);

      return {
        session: formatSession(session),
        token: makeSessionToken(session),
      };
    }),
  );
});
