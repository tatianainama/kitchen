import { ScrapingSource, ScrapedIngredient } from '@/types/scraper';
import { parseFromJsonLd, sanitizeInstructions } from './utils';
import slugify from '@/utils/slugify';
import parseIngredient from '../parser/ingredients';

const ALL_RECIPES: ScrapingSource = {
  name: 'All Recipes',
  domain: 'allrecipes',
  scrapeRecipe: ($: cheerio.Root) => {
    const { cookTime, prepTime, recipeYield, recipeInstructions } = parseFromJsonLd($);
    const name = $('h1').text().trim();
    return {
      name,
      cookTime: cookTime?.toString() || '',
      prepTime: prepTime?.toString() || '',
      yields: recipeYield?.toString() || '',
      ingredients: parseIngredients($),
      instructions: sanitizeInstructions(recipeInstructions),
      slug: slugify(name)
    };
  }
};

const parseIngredients = ($: cheerio.Root): ScrapedIngredient[] => {
  const rawData = $('section.recipe-ingredients fieldset').toArray();
  return rawData.reduce(
    (acc, fieldset) => {
      const group = $(fieldset).children('legend').text();
      const ingredients = $(fieldset).children('ul').children('li').
        toArray();

      const groupName = group === 'Ingredient Checklist'
        ? ''
        : group.trim().replace(
          ':',
          ''
        );

      return [
        ...acc,
        ...ingredients.map((i) => ({
          group: groupName,
          original: $(i).text().trim()
        }))
      ];
    },
    [] as { group: string, original: string}[]
  ).map((ingredient) => ({
    group: ingredient.group,
    ...parseIngredient(ingredient.original)
  }));
};

export default ALL_RECIPES;


