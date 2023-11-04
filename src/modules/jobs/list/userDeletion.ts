import { Session } from '@/db/models/Session';
import { User } from '@/db/models/User';
import { job } from '@/modules/jobs/job';

// every day at 12:00:00
export const userDeletionJob = job(
  'user-deletion',
  '0 12 * * *',
  async ({ em, log }) => {
    const knex = em.getKnex();

    // Count all sessions for a user ID
    const sessionCountForUser = em
      .createQueryBuilder(Session, 'session')
      .count()
      .where({ user: knex.ref('user.id') })
      .getKnexQuery();

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    // Delete all users who do not have any sessions AND
    // (their login date is null OR they last logged in over 1 year ago)
    const deletedUsers = await em
      .createQueryBuilder(User, 'user')
      .delete()
      .withSubQuery(sessionCountForUser, 'session.sessionCount')
      .where({
        'session.sessionCount': 0,
        $or: [
          { lastLoggedIn: { $eq: undefined } },
          { lastLoggedIn: { $lt: oneYearAgo } },
        ],
      })
      .execute<{ affectedRows: number }>('run');

    log.info(
      `Removed ${deletedUsers.affectedRows} users older than 1 year with no sessions`,
    );
  },
);
