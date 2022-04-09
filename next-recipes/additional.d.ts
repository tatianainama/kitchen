import { ParsedIngredient } from './utils/api/scrape/parser/ingredients';
import {
  Prisma,
  Recipe as SchemaRecipe,
  Ingredient,
  Author
} from '@prisma/client';

export namespace RecipeTypes {
  export type RecipeInput = Prisma.RecipeCreateInput & {
    instructions: string[],
    tags: string[],
    course: string[],
    ingredients: Prisma.IngredientCreateInput[];
    author: Prisma.AuthorCreateInput;
  };

  export type ScrapedRecipe = Prisma.RecipeCreateInput & {
    ingredients: Prisma.IngredientCreateInput[];
    author?: {
      name?: string;
      website?: string;
    };
  };

  export type ScrapedIngredient = ParsedIngredient & {
    group: '' | string;
  };

  export interface ScrapingSource {
    name: string;
    domain: string;
    scrapeRecipe($: cheerio.Root): ScrapedRecipe;
  }

  export type Recipe = SchemaRecipe & {
    ingredients: Ingredient[];
    author: Author;
  };
}

export namespace ServerResponses {
  export enum HttpStatus {
    BadRequest = 400,
    ServerError = 500,
    Success = 200
  }
}
