import { ParsedIngredient } from './backend/sources/scraper/parser/ingredients';
import {
  Prisma,
  Recipe as SchemaRecipe,
  Author,
  Course,
  Tag,
  Ingredient as IngredientDB,
  IngredientsOnRecipes
} from '@prisma/client';

export namespace RecipeTypes {
  export type IngredientInput = Partial<
    Omit<IngredientsOnRecipes & IngredientDB, 'id' | 'recipeId'>
  > & { name: string };
  export type Ingredient = IngredientsOnRecipes & IngredientDB;
  export type RecipeInput = Prisma.RecipeCreateInput & {
    image: string | File;
    instructions: string[];
    tags: Prisma.TagCreateInput[];
    courses: Prisma.CourseCreateInput[];
    ingredients: IngredientInput[];
    author: Prisma.AuthorCreateInput;
  };

  export type ScrapedRecipe = Prisma.RecipeCreateInput & {
    ingredients: IngredientInput[];
    tags?: Prisma.TagCreateInput[];
    courses?: Prisma.CourseCreateInput[];
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
    tags: Tag[];
    courses: Course[];
    ingredients: Ingredient[];
    author: Author;
  };
}
