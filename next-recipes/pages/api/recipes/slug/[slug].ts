import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { HttpStatus } from 'backend/types/serverResponse';

const handler: NextApiHandler = async (req, res) => {
  const {
    method,
    query: { slug }
  } = req;
  if (!slug || slug.toString() === '') {
    return res
      .status(HttpStatus.BadRequest)
      .json({ error: 'Invalid param slug, cannot be empty' });
  }
  switch (method) {
    case 'GET': {
      const slugInUse = await prisma.recipe.findUnique({
        where: {
          slug: slug.toString()
        }
      });
      if (slugInUse) {
        return res
          .status(HttpStatus.ServerError)
          .json({ error: 'Slug in use' });
      }
      return res.status(HttpStatus.Success).json({ message: 'Slug available' });
    }
  }
};

export default handler;
