import { RecipeTypes } from './../../../additional.d';
import { NextApiHandler } from 'next';
import { IngredientsOnRecipes, Recipe, Tag, Course } from '@prisma/client';
import prisma from '@/lib/prisma';
import slugify from '@/utils/slugify';
import fs from 'fs';
import { ServerResponses } from 'additional.d.ts';
import axios from 'axios';
import { createErrorMessage, CreateError } from '@/utils/api/errorHandler';

type CreateResponse = Recipe & {
  tags: Tag[];
  courses: Course[];
  ingredients: IngredientsOnRecipes[];
};
type RecipeInputBody = RecipeTypes.RecipeInput & { imageBlob: string };
const handler: NextApiHandler<CreateResponse | CreateError> = async (
  req,
  res
) => {
  switch (req.method) {
    case 'POST': {
      try {
        const { ingredients, author, imageBlob, tags, courses, ...recipe } =
          req.body as RecipeInputBody;
        const slug = recipe.slug || slugify(recipe.name);
        const image = imageBlob
          ? saveImage(imageBlob, slug)
          : recipe.image
          ? await downloadImage(recipe.image, slug)
          : '';

        const mkConnectOrCreate = (array: { name: string }[]) =>
          array.map((data) => ({
            where: data,
            create: data
          }));

        const ingredientList = ingredients
          .filter((data) => !!data.ingredient)
          .map((data) => data.ingredient);

        await prisma.ingredient.createMany({
          data: ingredientList.map((ingredient) => ({ ingredient })),
          skipDuplicates: true
        });

        const connectIngredients = await prisma.ingredient
          .findMany({
            where: {
              ingredient: {
                in: ingredientList
              }
            }
          })
          .then((foundIngredients) => {
            return foundIngredients.map(({ id, ingredient }) => {
              const data = ingredients.find((i) => i.ingredient === ingredient);
              return {
                id,
                group: data.group || '',
                original: data.group || '',
                ...data
              };
            });
          });

        const createRecipeAndIngredients = await prisma.recipe.create({
          data: {
            ...recipe,
            tags: {
              connectOrCreate: mkConnectOrCreate(tags || [])
            },
            courses: {
              connectOrCreate: mkConnectOrCreate(courses || [])
            },
            image,
            slug,
            ingredients: {
              create: connectIngredients.map(({ id, ingredient, ...rest }) => ({
                ...rest,
                ingredientId: id
              }))
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
            tags: true,
            courses: true,
            ingredients: true
          }
        });

        return res
          .status(ServerResponses.HttpStatus.Success)
          .json(createRecipeAndIngredients);
      } catch (error) {
        return res
          .status(ServerResponses.HttpStatus.ServerError)
          .json(createErrorMessage(error));
      }
    }
    default: {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} not allowed`);
    }
  }
};

// TODO: Optimize image before saving
const downloadImage = async (url: string, name: string): Promise<string> => {
  try {
    const extension = url.split('/').at(-1).split('.').at(-1);
    const filename = `${name}.${extension}`;
    const path = `${process.env.PUBLIC_ASSETS_PATH}/${filename}`;

    const response = await axios({
      url,
      responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(path))
        .on('finish', () => resolve(filename))
        .on('error', (e) => reject(e));
    });
  } catch (e) {
    console.error('Error while downloading image', e);
    return '';
  }
};

// TODO: Optimize image before saving
const saveImage = (image: string, name: string) => {
  try {
    const [prefix, base64Img] = image.split(',');
    if (base64Img) {
      const filename = `${name}.${prefix
        .replace('data:image/', '')
        .replace('"', '')
        .split(';', 1)
        .toString()}`;
      const location = `${process.env.PUBLIC_ASSETS_PATH}/${filename}`;
      fs.writeFileSync(location, base64Img, { encoding: 'base64' });
      return filename;
    }
    return '';
  } catch (error) {
    console.error('Error while saving image', error);
    return '';
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  }
};

export default handler;
