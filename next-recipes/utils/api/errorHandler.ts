import { Recipe, Ingredient, Prisma, Author } from '@prisma/client';

type RecipeCreateResult = Recipe & {
  ingredients: Ingredient[];
  author: Author;
};

export type CreateError = {
  error: string;
  target?: Array<keyof RecipeCreateResult>;
};

const isClientKnownRequestError = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError =>
  error instanceof Prisma.PrismaClientKnownRequestError;

export const createErrorMessage = (error: unknown): CreateError => {
  if (isClientKnownRequestError(error)) {
    if (error.code === 'P2002') {
      const message = error.message.split('\n').at(-1).trim();
      const fields = error.meta['target'] || [];
      if (fields.includes('name') && fields.includes('authorId')) {
        return {
          error: `This author already has a recipe with this name`,
          target: ['name']
        };
      }
      return {
        error: message || error.message,
        target: fields
      };
    }
  }
  console.info(error);
  return { error: `Error while creating recipe ${error}` };
};
