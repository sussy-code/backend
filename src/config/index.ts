import { devFragment } from '@/config/fragments/dev';
import { configSchema } from '@/config/schema';
import { createConfigLoader } from 'neat-config';

const fragments = {
  dev: devFragment,
};

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
