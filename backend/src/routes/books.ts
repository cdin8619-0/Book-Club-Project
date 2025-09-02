import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import prisma from '../utils/prisma';

const bookSchema = z.object({
  title: z.string(),
  authorId: z.number(),
  description: z.string().optional(),
  publishedYear: z.number().optional(),
});

export default async function bookRoutes(server: FastifyInstance) {
  server.get('/books', async () => {
    return prisma.book.findMany();
  });

  server.get('/books/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const book = await prisma.book.findUnique({ where: { id: Number(id) } });
    if (!book) {
      return reply.status(404).send({ error: 'Book not found' });
    }
    return book;
  });

  server.post('/books', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = bookSchema.parse(request.body);
      const newBook = await prisma.book.create({ data });
      return reply.status(201).send(newBook);
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  server.put('/books/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    try {
      const data = bookSchema.parse(request.body);
      const updatedBook = await prisma.book.update({
        where: { id: Number(id) },
        data,
      });
      return updatedBook;
    } catch (error) {
      return reply.status(400).send({ error: (error as Error).message });
    }
  });

  server.delete('/books/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    try {
      await prisma.book.delete({ where: { id: Number(id) } });
      return reply.status(204).send();
    } catch (error) {
      return reply.status(404).send({ error: 'Book not found' });
    }
  });
}
