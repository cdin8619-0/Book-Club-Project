import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import prisma from '../utils/prisma';

export default async function healthRoutes(server: FastifyInstance) {
  server.get('/health', async (_request: FastifyRequest, reply: FastifyReply) => {
    return { status: 'ok' };
  });

  server.get('/ready', async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { status: 'ready' };
    } catch (e) {
      return reply.status(503).send({ status: 'unready' });
    }
  });
}

