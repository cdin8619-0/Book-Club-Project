import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import prisma from '../utils/prisma';

const authorSchema = z.object({
  name: z.string(),
  bio: z.string().optional(),
});

export default async function authorRoutes(server: FastifyInstance) {
  server.get('/authors', async () => {
    return prisma.author.findMany();
  });

  server.get('/authors/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const author = await prisma.author.findUnique({ where: { id: Number(id) } });
    if (!author) {
      return reply.status(404).send({ error: 'Author not found' });
    }
    return author;
  });

  server.post('/authors', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = authorSchema.parse(request.body);
      const newAuthor = await prisma.author.create({ data });
      return reply.status(201).send(newAuthor);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  server.put('/authors/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    try {
      const data = authorSchema.parse(request.body);
      const existingAuthor = await prisma.author.findUnique({ where: { id: Number(id) } });
      if (!existingAuthor) {
        return reply.status(404).send({ error: 'Author not found' });
      }
      const updatedAuthor = await prisma.author.update({
        where: { id: Number(id) },
        data,
      });
      return updatedAuthor;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Record to update not found')) {
        return reply.status(404).send({ error: 'Author not found' });
      }
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  server.delete('/authors/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    try {
      await prisma.author.delete({ where: { id: Number(id) } });
      return reply.status(204).send();
    } catch (error) {
      return reply.status(404).send({ error: 'Author not found' });
    }
  });
}
