import { NextApiHandler } from 'next';
import prisma from '@/lib/prisma';
import slugify from '@/utils/slugify';
import fs from 'fs';

const handler: NextApiHandler = async (req, res) => {
  const { ingredients, author, ...recipe } = req.body;
  const slug = recipe.slug || slugify(recipe.name);
  const image = saveImage(
    recipe.image,
    slug
  );
  const createRecipeAndIngredients = await prisma.recipe.create({
    data: {
      ...recipe,
      image,
      slug,
      ingredients: {
        create: ingredients
      },
      author: {
        connectOrCreate: {
          where: {
            website: author.website
          },
          create: author
        }
      }
    },
    include: {
      ingredients: true
    }
  });

  res.json(createRecipeAndIngredients);
};

// Optimize image before saving
const saveImage = (image: string, name: string) => {
  try {
    const [
      prefix,
      base64Img
    ] = image.split(',');
    if (base64Img) {
      const filename = `${name}.${prefix.replace(
        'data:image/',
        ''
      ).replace(
        '"',
        ''
      ).split(
        ';',
        1
      ).
        toString()}`;
      const location = `${process.env.PUBLIC_ASSETS_PATH}/${filename}`;
      fs.writeFileSync(
        location,
        base64Img,
        { encoding: 'base64' }
      );
      return location;
    }
    return '';
  } catch (error) {
    console.error(
      'Error while saving image',
      error
    );
    return '';
  }
};
export default handler;

