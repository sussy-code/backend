import { conf, version } from '@/config';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';

export const metaRouter = makeRouter((app) => {
  app.get(
    '/healthcheck',
    handle(async ({ em, res }) => {
      const databaseConnected = await em.config
        .getDriver()
        .getConnection()
        .isConnected();

      const healthy = databaseConnected;
      if (!healthy) res.status(503);

      return {
        healthy,
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
        version: version,
        hasCaptcha: conf.captcha.enabled,
        captchaClientKey: conf.captcha.clientKey,
      };
    }),
  );
});
