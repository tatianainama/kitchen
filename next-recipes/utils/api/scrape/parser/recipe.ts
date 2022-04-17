/* eslint-disable consistent-return */
import slugify from '@/utils/slugify';
import { Recipe, ImageObject, Person } from 'schema-dts';
import parseIngredient from './ingredients';
import { RecipeTypes } from 'additional';

type AuthorJsonLd = {
  '@type': 'Person';
  name: string;
  url: string;
};

type RecipeJsonLd = Recipe & {
  image?: ImageObject;
  author?: Person | AuthorJsonLd | AuthorJsonLd[];
};

export const parseFromJsonLd = ($: cheerio.Root): RecipeTypes.ScrapedRecipe => {
  try {
    const jsonData = $('script[type="application/ld+json"]').html();
    const data = JSON.parse(jsonData);

    const rawRecipe = getRecipe(data);

    const name = rawRecipe.name?.toString() || '';
    const slug = slugify(name);
    return {
      ...sanitizeRecipeDetails(rawRecipe),
      author: sanitizeAuthor(rawRecipe.author),
      name,
      slug,
      instructions: sanitizeInstructions(rawRecipe.recipeInstructions),
      ingredients: sanitizeIngredients(toArray(rawRecipe.recipeIngredient))
    };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(`Couldn't fetch JSON from recipe: ${e}`);
    return {
      name: '',
      slug: '',
      instructions: [],
      ingredients: [],
      prepTime: '',
      cookTime: '',
      yields: 0,
      serves: '',
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

export const sanitizeInstructions = (JsonLdInstructions: unknown): string[] =>
  Array.isArray(JsonLdInstructions)
    ? JsonLdInstructions.map((instruction) => {
        if (typeof instruction === 'string') {
          return instruction;
        }
        if (instruction['@type'] === 'HowToStep') {
          return instruction.text;
        }
        if (
          instruction['@type'] === 'HowToSection' &&
          instruction.itemListElement
        ) {
          return (
            instruction.itemListElement[0].text ||
            instruction.itemListElement[0].name
          );
        }
        return '';
      })
    : [];

const sanitizeAuthor = (
  author: Person | AuthorJsonLd | AuthorJsonLd[]
): { name: string; website?: string } | null => {
  if (typeof author === 'string') {
    return {
      name: author
    };
  }

  if (Array.isArray(author)) {
    const data = author.find((element) => element['@type'] === 'Person');
    return data
      ? {
          name: data.name,
          website: data.url
        }
      : null;
  }

  return author['@type'] === 'Person'
    ? {
        name: toString(author.name),
        website: toString(author?.url)
      }
    : null;
};

const getNumbers = /(\d+)/;

export const parseYields = (yields: string): number => {
  return parseInt(yields.match(getNumbers)[0]) || 0;
};

const sanitizeRecipeDetails = (recipe: RecipeJsonLd) => ({
  summary: toString(recipe.description),
  prepTime: toString(recipe.prepTime),
  cookTime: toString(recipe.cookTime),
  totalTime: toString(recipe.totalTime),
  image: toString(sanitizeImage(recipe)),
  yields: parseYields(toString(recipe.recipeYield)),
  serves: toString(recipe.recipeYield),
  tags: [...toArray(recipe.keywords), ...toArray(recipe.recipeCuisine)].filter(
    Boolean
  ),
  course: toArray(recipe.recipeCategory)
});

const toArray = (data: unknown): string[] =>
  Array.isArray(data)
    ? data
    : toString(data)
        .split(',')
        .map((text) => text.trim());

const toString = (data: unknown): string =>
  data ? (data.toString() || String(data) || '').trim() : '';

const sanitizeIngredients = (rawIngredients?: string[]) => {
  if (!rawIngredients) {
    return [];
  }

  return rawIngredients.map((ingredient) => ({
    ...parseIngredient(ingredient),
    group: ''
  }));
};

const sanitizeImage = (rawRecipe: RecipeJsonLd) => {
  if (rawRecipe.image) {
    if (typeof rawRecipe.image === 'string') {
      return rawRecipe.image;
    }
    if (Array.isArray(rawRecipe.image)) {
      return rawRecipe.image[0];
    }
    if (rawRecipe.image.url) {
      return rawRecipe.image.url;
    }
  }
  return '';
};
