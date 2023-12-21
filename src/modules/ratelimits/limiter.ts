import Redis from 'ioredis';
import RateLimiter from 'async-ratelimiter';
import ms from 'ms';
import { StatusError } from '@/services/error';
import { IpReq, getIp } from '@/services/ip';

export interface LimiterOptions {
  redis: Redis;
}

interface LimitBucket {
  limiter: RateLimiter;
}

interface BucketOptions {
  id: string;
  window: string;
  max: number;
  inc?: number;
}

export class Limiter {
  private redis: Redis;
  private buckets: Record<string, LimitBucket> = {};

  constructor(ops: LimiterOptions) {
    this.redis = ops.redis;
  }

  async bump(req: IpReq, ops: BucketOptions) {
    const ip = getIp(req);
    if (!this.buckets[ops.id]) {
      this.buckets[ops.id] = {
        limiter: new RateLimiter({
          db: this.redis,
          namespace: `RATELIMIT_${ops.id}`,
          duration: ms(ops.window),
          max: ops.max,
        }),
      };
    }

    for (let i = 1; i < (ops.inc ?? 0); i++) {
      await this.buckets[ops.id].limiter.get({
        id: ip,
      });
    }
    const currentLimit = await this.buckets[ops.id].limiter.get({
      id: ip,
    });

    return {
      hasBeenLimited: currentLimit.remaining <= 0,
      limit: currentLimit,
    };
  }

  async assertAndBump(req: IpReq, ops: BucketOptions) {
    const { hasBeenLimited } = await this.bump(req, ops);
    if (hasBeenLimited) {
      throw new StatusError('Ratelimited', 429);
    }
  }
}
