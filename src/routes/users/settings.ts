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
          applicationLanguage: z.string().optional(),
          applicationTheme: z.string().optional(),
          defaultSubtitleLanguage: z.string().optional(),
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

      if (body.applicationLanguage)
        settings.applicationLanguage = body.applicationLanguage;
      if (body.applicationTheme)
        settings.applicationTheme = body.applicationTheme;
      if (body.defaultSubtitleLanguage)
        settings.defaultSubtitleLanguage = body.defaultSubtitleLanguage;

      await em.persistAndFlush(settings);
      return formatUserSettings(settings);
    }),
  );
});
