import { NextApiHandler } from 'next';
import { Ingredient, Recipe } from '@prisma/client';
import prisma from '@/lib/prisma';
import slugify from '@/utils/slugify';
import fs from 'fs';
import { ServerResponses } from 'additional.d.ts';
import axios from 'axios';
import { createErrorMessage, CreateError } from '@/utils/api/errorHandler';

type CreateResponse = Recipe & { ingredients: Ingredient[] };

const handler: NextApiHandler<CreateResponse | CreateError> = async (
  req,
  res
) => {
  try {
    const { ingredients, author, imageBlob, ...recipe } = req.body;
    const slug = recipe.slug || slugify(recipe.name);
    const image = imageBlob
      ? saveImage(imageBlob, slug)
      : recipe.image
      ? await downloadImage(recipe.image, slug)
      : '';

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

    res
      .status(ServerResponses.HttpStatus.Success)
      .json(createRecipeAndIngredients);
  } catch (error) {
    return res
      .status(ServerResponses.HttpStatus.ServerError)
      .json(createErrorMessage(error));
  }
};

// TODO: Optimize image before saving
const downloadImage = async (url: string, name: string) => {
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
