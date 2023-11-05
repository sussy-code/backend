import { createConfigLoader } from 'neat-config';
import { z } from 'zod';

export const ormConfigSchema = z.object({
  postgres: z.object({
    // connection URL for postgres database
    connection: z.string(),
  }),
});

export const ormConf = createConfigLoader()
  .addFromEnvironment('MWB_')
  .addFromCLI('mwb-')
  .addFromFile('.env', {
    prefix: 'MWB_',
  })
  .addFromFile('config.json')
  .addZodSchema(ormConfigSchema)
  .freeze()
  .load();
