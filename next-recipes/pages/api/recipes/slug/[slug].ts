import prisma from '@/lib/prisma';
import { NextApiHandler } from 'next';
import { ServerResponses } from 'additional';

const handler: NextApiHandler = async (req, res) => {
  const {
    method,
    query: { slug }
  } = req;
  if (!slug || slug.toString() === '') {
    return res
      .status(ServerResponses.HttpStatus.BadRequest)
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
          .status(ServerResponses.HttpStatus.ServerError)
          .json({ error: 'Slug in use' });
      }
      return res
        .status(ServerResponses.HttpStatus.Success)
        .json({ message: 'Slug available' });
    }
  }
};

export default handler;
