import { formatSession } from '@/db/models/Session';
import { User, formatUser } from '@/db/models/User';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { makeSession, makeSessionToken } from '@/services/session';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().max(500).min(1),
  device: z.string().max(500).min(1),
});

export const manageAuthRouter = makeRouter((app) => {
  app.post(
    '/auth/register',
    { schema: { body: registerSchema } },
    handle(async ({ em, body, req }) => {
      const user = new User();
      user.name = body.name;
      const session = makeSession(
        user.id,
        body.device,
        req.headers['user-agent'],
      );

      em.persist([user, session]);
      await em.flush();

      return {
        user: formatUser(user),
        session: formatSession(session),
        token: makeSessionToken(session),
      };
    }),
  );
});
