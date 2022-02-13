/* eslint-disable consistent-return */
import slugify from '@/utils/slugify';
import { Recipe as RecipeJsonLd } from 'schema-dts';
import parseIngredient, { ParsedIngredient } from './ingredients';

type ParsedFromJson = {
  name: string;
  slug: string;
  instructions: string[];
  ingredients: ParsedIngredient[];
  prepTime: string;
  cookTime: string;
  yields: string;
  tags: string[];
  course: string[];
}

export const parseFromJsonLd = ($: cheerio.Root): ParsedFromJson => {
  try {
    const jsonData = $('script[type="application/ld+json"]').html();
    const data = JSON.parse(jsonData);

    const rawRecipe = getRecipe(data);
    const name = rawRecipe.name?.toString() || '';
    const slug = slugify(name);
    return {
      ...sanitizeRecipeDetails(rawRecipe),
      name,
      slug,
      instructions: sanitizeInstructions(rawRecipe.recipeInstructions),
      ingredients: sanitizeIngredients(toArray(rawRecipe.recipeIngredient))
    };
  } catch (e) {
    console.info(`Couldn't fetch JSON from recipe: ${e}`);
    return {
      name: '',
      slug: '',
      instructions: [],
      ingredients: [],
      prepTime: '',
      cookTime: '',
      yields: '',
      tags: [],
      course: []
    };
  }
};

const getRecipe = (rawJson: unknown): RecipeJsonLd | undefined => {
  if (Array.isArray(rawJson)) {
    return rawJson.find((schema) => schema['@type'] === 'Recipe');
  }

  if (rawJson['@graph'] && Array.isArray(rawJson['@graph'])) {
    return rawJson['@graph'].find((schema) => schema['@type'] === 'Recipe');
  }

  if (rawJson['@type'] && rawJson['@type'] === 'Recipe') {
    return rawJson as RecipeJsonLd;
  }
};

export const sanitizeInstructions = (JsonLdInstructions: unknown): string[] => Array.isArray(JsonLdInstructions)
  ? JsonLdInstructions.map((instruction) => {
    if (typeof instruction === 'string') {
      return instruction;
    }
    if (instruction['@type'] === 'HowToStep') {
      return instruction.text;
    }
    if (instruction['@type'] === 'HowToSection' && instruction.itemListElement) {
      return instruction.itemListElement[0].text || instruction.itemListElement[0].name;
    }
    return '';
  })
  : [];

const sanitizeRecipeDetails = (recipe: RecipeJsonLd) => ({
  prepTime: toString(recipe.prepTime),
  cookTime: toString(recipe.cookTime),
  yields: toString(recipe.recipeYield),
  tags: [
    ...toArray(recipe.keywords),
    ...toArray(recipe.recipeCuisine)
  ].filter(Boolean),
  course: toArray(recipe.recipeCategory)
});

const toArray = (data: unknown): string[] => Array.isArray(data)
  ? data
  : toString(data).split(',').map((text) => text.trim());

const toString = (data: unknown): string => data
  ? data.toString() || String(data) || ''
  : '';

const sanitizeIngredients = (rawIngredients?: string[]) => {
  if (!rawIngredients) {
    return [];
  }

  return rawIngredients.map((ingredient) => parseIngredient(ingredient));
};
