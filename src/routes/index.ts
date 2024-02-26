import { version } from '@/config';
import { handle } from '@/services/handler';
import { makeRouter } from '@/services/router';

export const indexRouter = makeRouter((app) => {
  app.get(
    '/',
    handle(async () => {
      return {
        message: `Backend is working as expected (${version})`,
      };
    }),
  );
});
