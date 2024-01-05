import { conf } from '@/config';
import { scopedLogger } from '@/services/logger';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroORM } from '@mikro-orm/core';
import { createORM } from './orm';

const log = scopedLogger('orm');
let orm: MikroORM<PostgreSqlDriver> | null = null;

export function getORM() {
  if (!orm) throw new Error('ORM not set');
  return orm;
}

export async function setupMikroORM() {
  log.info(`Connecting to postgres`, { evt: 'connecting' });
  const mikro = await createORM(
    conf.postgres.connection,
    conf.postgres.debugLogging,
    (msg) => log.info(msg),
    conf.postgres.ssl,
  );

  if (conf.postgres.syncSchema) {
    const generator = mikro.getSchemaGenerator();
    try {
      await generator.updateSchema();
    } catch {
      try {
        await generator.clearDatabase();
        await generator.updateSchema();
      } catch {
        await generator.clearDatabase();
        await generator.dropSchema();
        await generator.updateSchema();
      }
    }
  }

  if (conf.postgres.migrateOnBoot) {
    const migrator = mikro.getMigrator();
    await migrator.up();
  }

  orm = mikro;
  log.info(`Connected to postgres - ORM is setup!`, { evt: 'success' });
}
