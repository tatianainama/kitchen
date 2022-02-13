import { ParsedIngredient } from './../utils/api/scrape/parser/ingredients';
import { Prisma } from '@prisma/client';

type Recipe = Prisma.RecipeCreateInput & {
  ingredients: Prisma.IngredientCreateInput[]
}

export type ScrapedRecipe = {
  name: string;
  slug: string;
  instructions: string[];
  ingredients: ScrapedIngredient[];
  prepTime: string;
  cookTime: string;
  yields: string;
  tags: string[];
  course: string[];
}

export type ScrapedIngredient = ParsedIngredient & {
  group: '' | string,
}

export interface ScrapingSource {
  name: string,
  domain: string,
  scrapeRecipe($: cheerio.Root): ScrapedRecipe,
}
