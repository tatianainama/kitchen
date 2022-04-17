import { parseYields } from './../parser/recipe';
/* eslint-disable max-statements */
import { RecipeTypes } from 'additional';
import parseIngredient from '../parser/ingredients';
import slugify from '@/utils/slugify';

const DATA = {
  name: 'Laura in the Kitchen',
  domain: 'laurainthekitchen',
  website: 'https://laurainthekitchen.com'
};

const LITK: RecipeTypes.ScrapingSource = {
  name: DATA.name,
  domain: DATA.domain,
  scrapeRecipe: ($) => {
    const jsonData = $('script[type="application/ld+json"]').html();
    const {
      cookTime,
      prepTime,
      recipeInstructions,
      recipeYield,
      image
    }: { [key: string]: string } = JSON.parse(jsonData.replace(/\n/gu, ' '));
    const name = $('h1').text().trim();
    return {
      name,
      author: {
        name: DATA.name,
        website: DATA.website
      },
      image,
      cookTime,
      prepTime,
      yields: parseYields(recipeYield),
      serves: recipeYield,
      ingredients: parseIngredients($),
      instructions: parseInstructions(recipeInstructions),
      slug: slugify(name)
    };
  }
};

const parseInstructions = (instructions: string): string[] =>
  instructions
    .split(/\d+[)]/u)
    .map((x) => x.trim())
    .filter((x) => x !== '');

const parseIngredients = ($): RecipeTypes.ScrapedIngredient[] => {
  const list = $('#recipe-ingredients > ul').children().toArray() as {
    tagName: string;
  }[];
  const isNewGroup = (tagName: string): boolean => tagName === 'span';
  return list
    .reduce((acc, rawIngredient) => {
      const last = acc.length === 0 ? 0 : acc.length - 1;
      const text: string = $(rawIngredient).text().trim();
      // Skipping empty ingredients
      if (!text) {
        return acc;
      }
      // If a new group is starting, just return the groupname
      if (isNewGroup(rawIngredient.tagName)) {
        return acc.concat({
          group: text,
          original: ''
        });
      }
      // Continue using same group
      if (!acc[last] || acc[last]?.original) {
        return acc.concat({
          original: text,
          group: acc[last]?.group || ''
        });
      }
      // If prev was just groupname, fill up the text
      acc[last].original = text;
      acc[last].group ??= '';
      return acc;
    }, [] as { original: string; group: string }[])
    .map((ingredient) => ({
      ...ingredient,
      ...parseIngredient(ingredient.original)
    }));
};

export default LITK;
