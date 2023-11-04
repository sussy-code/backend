import { conf } from '@/config';
import Redis from 'ioredis';

export function connectRedis() {
  if (!conf.ratelimits.redisUrl) throw new Error('missing redis URL');
  return new Redis(conf.ratelimits.redisUrl);
}
