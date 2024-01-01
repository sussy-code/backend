import { ormConf } from '@/config/orm';
import { makeOrmConfig } from '@/modules/mikro/orm';

export default makeOrmConfig(ormConf.postgres.connection, ormConf.postgres.ssl);
