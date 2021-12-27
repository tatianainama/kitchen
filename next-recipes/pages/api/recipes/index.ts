import { NextApiHandler } from 'next';
import prisma from '@/lib/prisma';

const handler: NextApiHandler = async (req, res) => {
  const recipe = req.body;
  const createdRecipe = await prisma.recipe.create({
    data: {
      ...recipe,
      author: {
        connectOrCreate: {
          where: {
            website: recipe.author.website
          },
          create: {
            ...recipe.author
          }
        }
      },
      ingredients: {
        create: [...recipe.ingredients]
      }
    }
  });

  res.json(createdRecipe);
};

export default handler;

