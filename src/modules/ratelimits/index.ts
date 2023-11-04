import { conf } from '@/config';
import { Limiter } from '@/modules/ratelimits/limiter';
import { connectRedis } from '@/modules/ratelimits/redis';
import { scopedLogger } from '@/services/logger';

const log = scopedLogger('ratelimits');

let limiter: null | Limiter = null;

export function getLimiter() {
  return limiter;
}

export async function setupRatelimits() {
  if (!conf.ratelimits.enabled) {
    log.warn('Ratelimits disabled!');
    return;
  }
  const redis = await connectRedis();
  limiter = new Limiter({
    redis,
  });
  log.info('Ratelimits have been setup!');
}
