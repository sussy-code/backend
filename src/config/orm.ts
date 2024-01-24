import { devFragment } from '@/config/fragments/dev';
import { dockerFragment } from '@/config/fragments/docker';
import { createConfigLoader } from 'neat-config';
import { z } from 'zod';
import { booleanSchema } from './schema';

const fragments = {
  dev: devFragment,
  dockerdev: dockerFragment,
};

export const ormConfigSchema = z.object({
  postgres: z.object({
    // connection URL for postgres database
    connection: z.string(),
    // whether to use SSL for the connection
    ssl: booleanSchema.default(false),
  }),
});

export const ormConf = createConfigLoader()
  .addFromEnvironment('MWB_')
  .addFromCLI('mwb-')
  .addFromFile('.env', {
    prefix: 'MWB_',
  })
  .addFromFile('config.json')
  .setFragmentKey('usePresets')
  .addConfigFragments(fragments)
  .addZodSchema(ormConfigSchema)
  .freeze()
  .load();
