import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';
import path from 'path';

export async function createORM(url: string, log: (msg: string) => void) {
  return await MikroORM.init<PostgreSqlDriver>({
    type: 'postgresql',
    clientUrl: url,
    entities: ['./models/**/*.js'],
    entitiesTs: ['./models/**/*.ts'],
    baseDir: path.join(__dirname, '../../db'),
    migrations: {
      pathTs: './migrations/**/*.ts',
      path: './migrations/**/*.ts',
    },
    logger: log,
  });
}
