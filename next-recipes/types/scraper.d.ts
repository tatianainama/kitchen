import { ParsedIngredient } from './../utils/api/scrape/parser/ingredients';
import { Prisma } from '@prisma/client';

type Recipe = Prisma.RecipeCreateInput & {
  ingredients: Prisma.IngredientCreateInput[]
}

export type ScrapedIngredient = ParsedIngredient & {
  group: '' | string,
}

export type ScrapedRecipe = {
  name: string,
  slug: string,
  prepTime?: string,
  cookTime?: string,
  yields?: string,
  video?: string,
  ingredients: ScrapedIngredient[],
  instructions: string[],
}

export interface ScrapingSource {
  name: string,
  domain: string,
  scrapeRecipe($: cheerio.Root): ScrapedRecipe,
}
