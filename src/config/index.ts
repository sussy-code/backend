import { devFragment } from '@/config/fragments/dev';
import { dockerFragment } from '@/config/fragments/docker';
import { configSchema } from '@/config/schema';
import { createConfigLoader } from 'neat-config';

const fragments = {
  dev: devFragment,
  dockerdev: dockerFragment,
};

export const version = '1.0.3';

export const conf = createConfigLoader()
  .addFromEnvironment('MWB_')
  .addFromCLI('mwb-')
  .addFromFile('.env', {
    prefix: 'MWB_',
  })
  .addFromFile('config.json')
  .addZodSchema(configSchema)
  .setFragmentKey('usePresets')
  .addConfigFragments(fragments)
  .freeze()
  .load();
