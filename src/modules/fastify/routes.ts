import { helloRouter } from '@/routes/hello';
import { FastifyInstance } from 'fastify';

export async function setupRoutes(app: FastifyInstance) {
  app.register(helloRouter);
}
