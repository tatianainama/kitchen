import { Recipe, Ingredient, Prisma, Author } from '@prisma/client';

type RecipeCreateResult = Recipe & {
  ingredients: Ingredient[];
  author: Author;
};

export type CreateError = {
  error: string;
  target?: keyof RecipeCreateResult[];
};

const isClientKnownRequestError = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError =>
  error instanceof Prisma.PrismaClientKnownRequestError;

export const createErrorMessage = (error: unknown): CreateError => {
  if (isClientKnownRequestError(error)) {
    if (error.code === 'P2002') {
      const message = error.message.split('\n').at(-1).trim();
      return {
        error: message || error.message,
        ...error.meta
      };
    }
  }
  console.info(error);
  return { error: `Error while creating recipe ${error}` };
};
