import { getORM } from '@/modules/mikro';
import { FastifyInstance } from 'fastify';
import { Counter } from 'prom-client';
import metricsPlugin from 'fastify-metrics';
import { updateMetrics } from '@/modules/metrics/update';
import { scopedLogger } from '@/services/logger';

const log = scopedLogger('metrics');

export type Metrics = {
  user: Counter<'namespace'>;
};

let metrics: null | Metrics = null;

export function getMetrics() {
  if (!metrics) throw new Error('metrics not initialized');
  return metrics;
}

export async function setupMetrics(app: FastifyInstance) {
  log.info(`Setting up metrics...`, { evt: 'start' });

  await app.register(metricsPlugin, { endpoint: '/metrics' });

  metrics = {
    user: new Counter({
      name: 'user_count',
      help: 'user_help',
      labelNames: ['namespace'],
    }),
  };

  const orm = getORM();
  const em = orm.em.fork();
  log.info(`Syncing up metrics...`, { evt: 'sync' });
  await updateMetrics(em, metrics);
  log.info(`Metrics initialized!`, { evt: 'end' });
}
