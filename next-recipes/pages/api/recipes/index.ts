import { NextApiHandler } from 'next';
import prisma from '@/lib/prisma';
import slugify from '@/utils/slugify';

const handler: NextApiHandler = async (req, res) => {
  const recipe = req.body;
  const slug = recipe.slug || slugify(recipe.name);
  const createdRecipe = await prisma.recipe.create({
    data: {
      ...recipe,
      slug,
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

