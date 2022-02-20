import { NextApiHandler } from 'next';
import prisma from '@/lib/prisma';
import slugify from '@/utils/slugify';
import fs from 'fs';

const handler: NextApiHandler = async (req, res) => {
  const { name, summary, prepTime, cookTime, yields, tags, course, instructions, ingredients, ...recipe } = req.body;
  const slug = recipe.slug || slugify(recipe.name);
  const image = saveImage(
    recipe.image,
    slug
  );
  const createRecipeAndIngredients = await prisma.recipe.create({
    data: {
      name,
      summary,
      prepTime,
      cookTime,
      yields,
      tags,
      course,
      instructions,
      image,
      slug,
      ingredients: {
        create: [...ingredients]
      }
    },
    include: {
      ingredients: true
    }
  });

  res.json(createRecipeAndIngredients);
};

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
      ).split(
        ';',
        1
      )}`;
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

