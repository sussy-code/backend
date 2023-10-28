import { User, formatUser } from '@/db/models/User';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().max(500).min(1),
  device: z.string().max(500).min(1),
});

export const manageAuthRouter = makeRouter((app) => {
  app.post(
    '/auth/register',
    { schema: { body: registerSchema } },
    handle(({ em, body }) => {
      const user = new User();
      user.name = body.name;
      em.persistAndFlush(user);

      return {
        user: formatUser(user),
      };
    }),
  );
});
