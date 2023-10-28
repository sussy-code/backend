import { manageAuthRouter } from '@/routes/auth/manage';
import { FastifyInstance } from 'fastify';

export async function setupRoutes(app: FastifyInstance) {
  app.register(manageAuthRouter.register);
}
