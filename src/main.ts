import {
  setupFastify,
  setupFastifyRoutes,
  startFastify,
} from '@/modules/fastify';
import { setupJobs } from '@/modules/jobs';
import { setupMetrics } from '@/modules/metrics';
import { setupMikroORM } from '@/modules/mikro';
import { setupRatelimits } from '@/modules/ratelimits';
import { scopedLogger } from '@/services/logger';

const log = scopedLogger('mw-backend');

async function bootstrap(): Promise<void> {
  log.info(`App booting...`, {
    evt: 'setup',
  });

  await setupRatelimits();
  const app = await setupFastify();
  await setupMikroORM();
  await setupMetrics(app);
  await setupJobs();

  await setupFastifyRoutes(app);
  await startFastify(app);

  log.info(`App setup, ready to accept connections`, {
    evt: 'success',
  });
  log.info(`--------------------------------------`);
}

bootstrap().catch((err) => {
  log.error(err, {
    evt: 'setup-error',
  });
  process.exit(1);
});
