import { UserSettings, formatUserSettings } from '@/db/models/UserSettings';
import { StatusError } from '@/services/error';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';
import { z } from 'zod';

export const userSettingsRouter = makeRouter((app) => {
  app.get(
    '/users/:uid/settings',
    {
      schema: {
        params: z.object({
          uid: z.string(),
        }),
      },
    },
    handle(async ({ auth, params, em }) => {
      await auth.assert();

      if (auth.user.id !== params.uid)
        throw new StatusError('Cannot get other user information', 403);

      const settings = await em.findOne(UserSettings, {
        id: params.uid,
      });

      if (!settings) return { id: params.uid };

      return formatUserSettings(settings);
    }),
  );

  app.put(
    '/users/:uid/settings',
    {
      schema: {
        params: z.object({
          uid: z.string(),
        }),
        body: z.object({
          applicationLanguage: z.string().nullable().optional(),
          applicationTheme: z.string().nullable().optional(),
          defaultSubtitleLanguage: z.string().nullable().optional(),
          proxyUrls: z.string().array().nullable().optional(),
        }),
      },
    },
    handle(async ({ auth, params, body, em }) => {
      await auth.assert();

      if (auth.user.id !== params.uid)
        throw new StatusError('Cannot modify user other than yourself', 403);

      let settings = await em.findOne(UserSettings, {
        id: params.uid,
      });
      if (!settings) {
        settings = new UserSettings();
        settings.id = params.uid;
      }

      if (body.applicationLanguage !== undefined)
        settings.applicationLanguage = body.applicationLanguage;
      if (body.defaultSubtitleLanguage !== undefined)
        settings.defaultSubtitleLanguage = body.defaultSubtitleLanguage;
      if (body.applicationTheme !== undefined)
        settings.applicationTheme = body.applicationTheme;
      if (body.proxyUrls !== undefined) settings.proxyUrls = body.proxyUrls;

      await em.persistAndFlush(settings);
      return formatUserSettings(settings);
    }),
  );
});
