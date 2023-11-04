import { User } from '@/db/models/User';
import { Metrics } from '@/modules/metrics';
import { EntityManager } from '@mikro-orm/postgresql';

export async function updateMetrics(em: EntityManager, metrics: Metrics) {
  const users = await em
    .createQueryBuilder(User)
    .groupBy('namespace')
    .count()
    .select(['namespace', 'count'])
    .execute<
      {
        namespace: string;
        count: string;
      }[]
    >();

  metrics.user.reset();

  users.forEach((v) => {
    metrics?.user.inc({ namespace: v.namespace }, Number(v.count));
  });
}
