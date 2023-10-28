import { setupFastify } from '@/modules/fastify';
import { setupMikroORM } from '@/modules/mikro';
import { scopedLogger } from '@/services/logger';

const log = scopedLogger('mw-backend');

async function bootstrap(): Promise<void> {
  log.info(`App booting...`, {
    evt: 'setup',
  });

  await setupFastify();
  await setupMikroORM();

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
