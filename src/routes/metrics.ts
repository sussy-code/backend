import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';
import { ProviderMetric, status } from '@/db/models/ProviderMetrics';
import { getMetrics } from '@/modules/metrics';

const metricsProviderSchema = z.object({
  tmdbId: z.string(),
  type: z.string(),
  title: z.string(),
  seasonId: z.string().optional(),
  episodeId: z.string().optional(),
  status: z.nativeEnum(status),
  providerId: z.string(),
  embedId: z.string().optional(),
  errorMessage: z.string().optional(),
  fullError: z.string().optional(),
});

const metricsProviderInputSchema = z.object({
  items: z.array(metricsProviderSchema).max(10).min(1),
});

export const metricsRouter = makeRouter((app) => {
  app.post(
    '/metrics/providers',
    {
      schema: {
        body: metricsProviderInputSchema,
      },
    },
    handle(async ({ em, body, req, limiter }) => {
      await limiter?.assertAndBump(req, {
        id: 'provider_metrics',
        max: 300,
        inc: body.items.length,
        window: '30m',
      });

      const hostname = req.headers.origin?.slice(0, 255) ?? 'unknown origin';

      const entities = body.items.map((v) => {
        const errorMessage = v.errorMessage?.slice(0, 200);
        const truncatedFullError = v.fullError?.slice(0, 2000);

        const metric = new ProviderMetric();
        em.assign(metric, {
          providerId: v.providerId,
          embedId: v.embedId,
          fullError: truncatedFullError,
          errorMessage: errorMessage,
          episodeId: v.episodeId,
          seasonId: v.seasonId,
          status: v.status,
          title: v.title,
          tmdbId: v.tmdbId,
          type: v.type,
          hostname,
        });
        return metric;
      });

      entities.forEach((entity) => {
        getMetrics().providerMetrics.inc({
          episode_id: entity.episodeId,
          provider_id: entity.providerId,
          season_id: entity.seasonId,
          status: entity.status,
          title: entity.title,
          tmdb_id: entity.tmdbId,
          type: entity.type,
          hostname,
        });
      });

      await em.persistAndFlush(entities);
      return true;
    }),
  );
});
