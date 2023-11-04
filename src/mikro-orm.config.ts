import { makeOrmConfig } from '@/modules/mikro/orm';
import { conf } from '@/config';

export default makeOrmConfig(conf.postgres.connection);
