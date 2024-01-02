import { Options } from '@mikro-orm/core';
import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';
import path from 'path';

export function makeOrmConfig(
  url: string,
  ssl: boolean,
): Options<PostgreSqlDriver> {
  return {
    type: 'postgresql',
    clientUrl: url,
    entities: ['./models/**/*.js'],
    entitiesTs: ['./models/**/*.ts'],
    baseDir: path.join(__dirname, '../../db'),
    migrations: {
      pathTs: './migrations',
      path: './migrations',
    },
    driverOptions: {
      connection: {
        ssl,
      },
    },
  };
}

export async function createORM(
  url: string,
  debug: boolean,
  log: (msg: string) => void,
  ssl: boolean,
) {
  return await MikroORM.init<PostgreSqlDriver>({
    ...makeOrmConfig(url, ssl),
    logger: log,
    debug,
  });
}
