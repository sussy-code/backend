import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { conf } from '@/config';
import { makeFastifyLogger, scopedLogger } from '@/services/logger';
import { setupRoutes } from './routes';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import { StatusError } from '@/services/error';

const log = scopedLogger('fastify');

export async function setupFastify(): Promise<FastifyInstance> {
  log.info(`setting up fastify...`, { evt: 'setup-start' });
  // create server
  const app = Fastify({
    logger: makeFastifyLogger(log) as any,
    trustProxy: conf.server.trustProxy,
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.setErrorHandler((err, req, reply) => {
    if (err instanceof ZodError) {
      reply.status(400).send({
        errorType: 'validation',
        errors: err.errors,
      });
      return;
    }

    if (err instanceof StatusError) {
      reply.status(err.errorStatusCode).send({
        errorType: 'message',
        message: err.message,
      });
      return;
    }

    log.error('unhandled exception on server:', err);
    log.error(err.stack);
    reply.status(500).send({
      errorType: 'message',
      message: 'Internal server error',
      ...(conf.logging.debug
        ? {
            trace: err.stack,
            errorMessage: err.toString(),
          }
        : {}),
    });
  });

  // plugins
  log.info(`setting up plugins`, { evt: 'setup-plugins' });
  const corsDomains = conf.server.cors.split(' ').filter((v) => v.length > 0);
  const corsSetting = conf.server.allowAnySite ? true : corsDomains;
  await app.register(cors, {
    origin: corsSetting,
    credentials: true,
  });

  return app;
}

export function startFastify(app: FastifyInstance) {
  // listen to port
  log.info(`listening to port`, { evt: 'setup-listen' });
  return new Promise<void>((resolve) => {
    app.listen(
      {
        port: conf.server.port,
        host: '0.0.0.0',
      },
      function (err) {
        if (err) {
          app.log.error(err);
          log.error(`Failed to setup fastify`, {
            evt: 'setup-error',
          });
          process.exit(1);
        }
        log.info(`fastify setup successfully`, {
          evt: 'setup-success',
        });
        resolve();
      },
    );
  });
}

export async function setupFastifyRoutes(app: FastifyInstance) {
  log.info(`setting up routes`, { evt: 'setup-plugins' });
  await app.register(
    async (api, opts, done) => {
      setupRoutes(api);
      done();
    },
    {
      prefix: conf.server.basePath,
    },
  );
}
