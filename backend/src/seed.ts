import 'dotenv/config';
import prisma from './utils/prisma';

async function main() {
  const author1 = await prisma.author.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'George Orwell', bio: 'Author of 1984 and Animal Farm' },
  });

  const author2 = await prisma.author.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Jane Austen', bio: 'Author of Pride and Prejudice' },
  });

  await prisma.book.createMany({
    data: [
      { title: '1984', authorId: author1.id, description: 'Dystopian novel', publishedYear: 1949 },
      { title: 'Animal Farm', authorId: author1.id, description: 'Political satire', publishedYear: 1945 },
      { title: 'Pride and Prejudice', authorId: author2.id, description: 'Romantic novel', publishedYear: 1813 },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed completed');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


