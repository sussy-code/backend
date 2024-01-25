import { getORM } from '@/modules/mikro';
import { FastifyInstance } from 'fastify';
import { Counter } from 'prom-client';
import metricsPlugin from 'fastify-metrics';
import { updateMetrics } from '@/modules/metrics/update';
import { scopedLogger } from '@/services/logger';

const log = scopedLogger('metrics');

export type Metrics = {
  user: Counter<'namespace'>;
  captchaSolves: Counter<'success'>;
  providerHostnames: Counter<'hostname'>;
  providerStatuses: Counter<'provider_id' | 'status'>;
  watchMetrics: Counter<'title' | 'tmdb_full_id' | 'provider_id' | 'success'>;
  toolMetrics: Counter<'tool'>;
};

let metrics: null | Metrics = null;

export function getMetrics() {
  if (!metrics) throw new Error('metrics not initialized');
  return metrics;
}

export async function setupMetrics(app: FastifyInstance) {
  log.info(`Setting up metrics...`, { evt: 'start' });

  await app.register(metricsPlugin, {
    endpoint: '/metrics',
    routeMetrics: {
      enabled: true,
      registeredRoutesOnly: true,
    },
  });

  metrics = {
    user: new Counter({
      name: 'mw_user_count',
      help: 'mw_user_help',
      labelNames: ['namespace'],
    }),
    captchaSolves: new Counter({
      name: 'mw_captcha_solves',
      help: 'mw_captcha_solves',
      labelNames: ['success'],
    }),
    providerHostnames: new Counter({
      name: 'mw_provider_hostname_count',
      help: 'mw_provider_hostname_count',
      labelNames: ['hostname'],
    }),
    providerStatuses: new Counter({
      name: 'mw_provider_status_count',
      help: 'mw_provider_status_count',
      labelNames: ['provider_id', 'status'],
    }),
    watchMetrics: new Counter({
      name: 'mw_media_watch_count',
      help: 'mw_media_watch_count',
      labelNames: ['title', 'tmdb_full_id', 'provider_id', 'success'],
    }),
    toolMetrics: new Counter({
      name: 'mw_provider_tool_count',
      help: 'mw_provider_tool_count',
      labelNames: ['tool'],
    }),
  };

  const promClient = app.metrics.client;

  promClient.register.registerMetric(metrics.user);
  promClient.register.registerMetric(metrics.providerHostnames);
  promClient.register.registerMetric(metrics.providerStatuses);
  promClient.register.registerMetric(metrics.watchMetrics);
  promClient.register.registerMetric(metrics.captchaSolves);
  promClient.register.registerMetric(metrics.toolMetrics);

  const orm = getORM();
  const em = orm.em.fork();
  log.info(`Syncing up metrics...`, { evt: 'sync' });
  await updateMetrics(em, metrics);
  log.info(`Metrics initialized!`, { evt: 'end' });
}
