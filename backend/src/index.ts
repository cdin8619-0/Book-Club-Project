import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import dotenv from 'dotenv';
import authorRoutes from './routes/authors';
import bookRoutes from './routes/books';
import healthRoutes from './routes/health';
import prisma from './utils/prisma';

dotenv.config();

const server = Fastify();

server.register(cors);
server.register(helmet);

server.get('/', async () => {
  return { message: 'Welcome to the Book Club API' };
});

server.register(healthRoutes);
server.register(authorRoutes);
server.register(bookRoutes);

const start = async () => {
  try {
    const port = Number(process.env.PORT || 3000);
    await server.listen({ port, host: '0.0.0.0' });
    await prisma.$connect();
    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
