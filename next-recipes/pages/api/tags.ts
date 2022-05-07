import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';

const handler: NextApiHandler = async (req, res) => {
  const {
    method,
    query: { search }
  } = req;
  switch (method) {
    case 'GET': {
      const tags = await prisma.tag.findMany({
        where: {
          name: {
            contains: search.toString() || '',
            mode: 'insensitive'
          }
        }
      });
      res.status(200).json(tags);
      break;
    }
    default: {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} not allowed`);
    }
  }
};

export default handler;
