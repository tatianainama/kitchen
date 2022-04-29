import { parseYields, sanitizeTag } from './../parser/recipe';
import slugify from '@/utils/slugify';
import parseIngredient from '../parser/ingredients';
import { RecipeTypes } from 'additional';

const INSPIRED_EATS: RecipeTypes.ScrapingSource = {
  name: 'Inspired Eats',
  domain: 'inspiredentertainment',
  scrapeRecipe: ($: cheerio.Root) => {
    const name = $('h3.title').text().trim();
    const [servings, tags] = $('.recipe__info li span')
      .toArray()
      .map((element) => $(element).text());

    return {
      name,
      image: $('.featured_image').attr('src'),
      cookTime: '',
      prepTime: '',
      tags: sanitizeTag((tags || '').split(', ')),
      yields: parseYields(servings || '0'),
      serves: servings,
      ingredients: parseIngredients($),
      instructions: parseInstructions($),
      slug: slugify(name)
    };
  }
};

const parseIngredients = ($: cheerio.Root): RecipeTypes.ScrapedIngredient[] => {
  const ingredientSection = $(
    '.section.section__basic-internal.section--content_block > .inner-wrapper'
  )
    .children('h5, ul')
    .toArray();

  let groupName = '';
  let ingredients: { group: string; original: string }[] = [];

  ingredientSection.forEach((element) => {
    if ($(element).is('h5')) {
      groupName = $(element).text();
    }

    if ($(element).is('ul')) {
      ingredients = ingredients.concat(
        $(element)
          .children('li')
          .filter((_, el) => $(el).text() !== '')
          .map((_, element) => ({
            group: groupName,
            original: $(element).text()
          }))
          .toArray() as unknown as { group: string; original: string }[]
      );
    }
  });

  return ingredients.map((item) => ({
    ...item,
    ...parseIngredient(item.original)
  }));
};

const parseInstructions = ($: cheerio.Root) => {
  return $(
    '.section.section__basic-internal.section--content_block > .inner-wrapper > p'
  )
    .text()
    .split('\n');
};

export default INSPIRED_EATS;
