import { z } from 'zod';

export const booleanSchema = z.preprocess((val) => val === 'true', z.boolean());

export const configSchema = z.object({
  server: z
    .object({
      // port of web server
      port: z.coerce.number().default(8080),

      // space seperated list of allowed cors domains
      cors: z.string().default(''),

      // disable cross origin restrictions, allow any site.
      // overwrites the cors option above
      allowAnySite: booleanSchema,

      // should it trust reverse proxy headers? (for ip gathering)
      trustProxy: booleanSchema,

      // should it trust cloudflare headers? (for ip gathering, cloudflare has priority)
      trustCloudflare: booleanSchema,

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
      debug: booleanSchema,
    })
    .default({}),
  postgres: z.object({
    // connection URL for postgres database
    connection: z.string(),

    // run all migrations on boot of the application
    migrateOnBoot: booleanSchema,

    // try to sync the schema on boot, useful for development
    // will always keep the database schema in sync with the connected database
    // it is extremely destructive, do not use it EVER in production
    syncSchema: booleanSchema,

    // Enable debug logging for MikroORM - Outputs queries and entity management logs
    // Do NOT use in production, leaks all sensitive data
    debugLogging: booleanSchema,

    // Enable SSL for the postgres connection
    ssl: booleanSchema,
  }),
  crypto: z.object({
    // session secret. used for signing session tokens
    sessionSecret: z.string().min(32),
  }),
  meta: z.object({
    // name and description of this backend
    // this is displayed to the client when making an account
    name: z.string().min(1),
    description: z.string().min(1).optional(),
  }),
  captcha: z
    .object({
      // enabled captchas on register
      enabled: booleanSchema,

      // captcha secret
      secret: z.string().min(1).optional(),

      clientKey: z.string().min(1).optional(),
    })
    .default({}),
  ratelimits: z
    .object({
      // enabled captchas on register
      enabled: booleanSchema,
      redisUrl: z.string().optional(),
    })
    .default({}),
});
