import { Session } from '@/db/models/Session';
import { job } from '@/modules/jobs/job';

// every day at 12:00:00
export const sessionExpiryJob = job('0 12 * * *', async ({ em }) => {
  await em
    .createQueryBuilder(Session)
    .delete()
    .where({
      expiresAt: {
        $lt: new Date(),
      },
    })
    .execute();
});
