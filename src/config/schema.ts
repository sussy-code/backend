import { z } from 'zod';

export const configSchema = z.object({
  server: z
    .object({
      // port of web server
      port: z.coerce.number().default(8080),

      // space seperated list of allowed cors domains
      cors: z.string().default(''),

      // should it trust reverse proxy headers? (for ip gathering)
      trustProxy: z.coerce.boolean().default(false),

      // prefix for where the instance is run on. for example set it to /backend if you're hosting it on example.com/backend
      // if this is set, do not apply url rewriting before proxing
      basePath: z.string().default('/'),
    })
    .default({}),
  logging: z
    .object({
      // format of the logs, JSON is recommended for production
      format: z.enum(['json', 'pretty']).default('pretty'),

      // show debug logs?
      debug: z.coerce.boolean().default(false),
    })
    .default({}),
  postgres: z.object({
    // connection URL for postgres database
    connection: z.string(),

    // run all migrations on boot of the application
    migrateOnBoot: z.coerce.boolean().default(false),

    // try to sync the schema on boot, useful for development
    // will always keep the database schema in sync with the connected database
    // it is extremely destructive, do not use it EVER in production
    syncSchema: z.coerce.boolean().default(false),
  }),
});
