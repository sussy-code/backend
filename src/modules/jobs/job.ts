import { getORM } from '@/modules/mikro';
import { scopedLogger } from '@/services/logger';
import { EntityManager } from '@mikro-orm/postgresql';
import { CronJob } from 'cron';
import { Logger } from 'winston';

const minOffset = 0;
const maxOffset = 60 * 4;
const secondsOffset =
  Math.floor(Math.random() * (maxOffset - minOffset)) + minOffset;

const log = scopedLogger('jobs');

const wait = (sec: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), sec * 1000);
  });

/**
 * @param cron crontime in this order: (min of hour) (hour of day) (day of month) (day of week) (sec of month)
 */
export function job(
  name: string,
  cron: string,
  cb: (ctx: { em: EntityManager; log: Logger }) => Promise<void>,
): CronJob {
  log.info(`Registering job '${name}' with cron '${cron}'`);
  return CronJob.from({
    cronTime: cron,
    onTick: async () => {
      // offset by random amount of seconds, just to prevent jobs running at
      // the same time when running multiple instances
      await wait(secondsOffset);

      // actually run the job
      try {
        const em = getORM().em.fork();
        log.info(`Starting job '${name}' with cron '${cron}'`);
        await cb({ em, log });
      } catch (err) {
        log.error(`Failed to run '${name}' job!`);
        log.error(err);
      }
    },
    start: false,
  });
}
