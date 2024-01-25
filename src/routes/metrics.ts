import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';
import { getMetrics } from '@/modules/metrics';
import { status } from '@/routes/statuses';

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
  tool: z.string().optional(),
});

export const metricsRouter = makeRouter((app) => {
  app.post(
    '/metrics/providers',
    {
      schema: {
        body: metricsProviderInputSchema,
      },
    },
    handle(async ({ body, req, limiter }) => {
      await limiter?.assertAndBump(req, {
        id: 'provider_metrics',
        max: 300,
        inc: body.items.length,
        window: '30m',
      });

      const hostname = req.headers.origin?.slice(0, 255) ?? '<UNKNOWN>';
      getMetrics().providerHostnames.inc({
        hostname,
      });

      body.items.forEach((item) => {
        getMetrics().providerStatuses.inc({
          provider_id: item.embedId ?? item.providerId,
          status: item.status,
        });
      });

      const itemList = [...body.items];
      itemList.reverse();
      const lastSuccessfulItem = body.items.find(
        (v) => v.status === status.success,
      );
      const lastItem = itemList[0];

      if (lastItem) {
        getMetrics().watchMetrics.inc({
          tmdb_full_id: lastItem.type + '-' + lastItem.tmdbId,
          provider_id: lastSuccessfulItem?.providerId ?? lastItem.providerId,
          title: lastItem.title,
          success: (!!lastSuccessfulItem).toString(),
        });
      }

      if (body.tool) {
        getMetrics().toolMetrics.inc({
          tool: body.tool,
        });
      }

      return true;
    }),
  );

  app.post(
    '/metrics/captcha',
    {
      schema: {
        body: z.object({
          success: z.boolean(),
        }),
      },
    },
    handle(async ({ body, req, limiter }) => {
      await limiter?.assertAndBump(req, {
        id: 'captcha_solves',
        max: 300,
        inc: 1,
        window: '30m',
      });

      getMetrics().captchaSolves.inc({
        success: body.success.toString(),
      });

      return true;
    }),
  );
});
