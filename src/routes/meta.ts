import { conf } from '@/config';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';

export const metaRouter = makeRouter((app) => {
  app.get(
    '/healthcheck',
    handle(async ({ em }) => {
      const databaseConnected = await em.config
        .getDriver()
        .getConnection()
        .isConnected();
      return {
        healthy: databaseConnected,
        databaseConnected,
      };
    }),
  );
  app.get(
    '/meta',
    handle(async () => {
      return {
        name: conf.meta.name,
        description: conf.meta.description,
      };
    }),
  );
});
