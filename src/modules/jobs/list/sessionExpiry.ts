import { Session } from '@/db/models/Session';
import { job } from '@/modules/jobs/job';

// every day at 12:00:00
export const sessionExpiryJob = job(
  'session-expiry',
  '0 12 * * *',
  async ({ em, log }) => {
    const deletedSessions = await em
      .createQueryBuilder(Session)
      .delete()
      .where({
        expiresAt: {
          $lt: new Date(),
        },
      })
      .execute<{ affectedRows: number }>('run');

    log.info(
      `Removed ${deletedSessions.affectedRows} sessions that had expired`,
    );
  },
);
