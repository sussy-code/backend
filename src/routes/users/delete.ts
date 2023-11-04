import { Bookmark } from '@/db/models/Bookmark';
import { ProgressItem } from '@/db/models/ProgressItem';
import { Session } from '@/db/models/Session';
import { User } from '@/db/models/User';
import { UserSettings } from '@/db/models/UserSettings';
import { StatusError } from '@/services/error';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';

export const userDeleteRouter = makeRouter((app) => {
  app.delete(
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

      const user = await em.findOne(User, { id: params.uid });
      if (!user) throw new StatusError('User does not exist', 404);

      if (auth.user.id !== user.id)
        throw new StatusError('Cannot delete user other than yourself', 403);

      // delete data
      await em
        .createQueryBuilder(Bookmark)
        .delete()
        .where({
          userId: user.id,
        })
        .execute();
      await em
        .createQueryBuilder(ProgressItem)
        .delete()
        .where({
          userId: user.id,
        })
        .execute();
      await em
        .createQueryBuilder(UserSettings)
        .delete()
        .where({
          id: user.id,
        })
        .execute();

      // delete account & login sessions
      const sessions = await em.find(Session, { user: user.id });
      await em.remove([user, ...sessions]);
      await em.flush();

      return {
        id: user.id,
      };
    }),
  );
});
