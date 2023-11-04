import { ProviderMetric } from '@/db/models/ProviderMetrics';
import { job } from '@/modules/jobs/job';
import ms from 'ms';

// every day at 12:00:00
export const providerMetricCleanupJob = job(
  'provider-metric-cleanup',
  '0 12 * * *',
  async ({ em, log }) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - ms('30d'));

    const deletedMetrics = await em
      .createQueryBuilder(ProviderMetric)
      .delete()
      .where({
        createdAt: {
          $lt: thirtyDaysAgo,
        },
      })
      .execute<{ affectedRows: number }>('run');

    log.info(
      `Removed ${deletedMetrics.affectedRows} metrics that were older than 30 days`,
    );
  },
);
