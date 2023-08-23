import { FastifyPluginAsync } from 'fastify';

export const helloRouter: FastifyPluginAsync = async (app) => {
  app.get('/ping', (req, res) => {
    res.send('pong!');
  });
};
