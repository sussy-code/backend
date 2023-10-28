import { loginAuthRouter } from '@/routes/auth/login';
import { manageAuthRouter } from '@/routes/auth/manage';
import { metaRouter } from '@/routes/meta';
import { sessionsRouter } from '@/routes/sessions';
import { userDeleteRouter } from '@/routes/users/delete';
import { userEditRouter } from '@/routes/users/edit';
import { userSessionsRouter } from '@/routes/users/sessions';
import { FastifyInstance } from 'fastify';

export async function setupRoutes(app: FastifyInstance) {
  app.register(manageAuthRouter.register);
  app.register(loginAuthRouter.register);
  app.register(userSessionsRouter.register);
  app.register(sessionsRouter.register);
  app.register(userEditRouter.register);
  app.register(userDeleteRouter.register);
  app.register(metaRouter.register);
}
