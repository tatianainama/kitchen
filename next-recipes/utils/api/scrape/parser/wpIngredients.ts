import { Prisma } from '@prisma/client';
import { parse } from 'recipe-ingredient-parser-v2';
import { parseUnit } from './ingredients';

export const parseWpIngredients = (
  $: cheerio.Root
): { ingredients: Prisma.IngredientCreateInput[] } => {
  try {
    const ingredientList = $(
      '.wprm-recipe-ingredients-container',
      '.wprm-recipe'
    );
    const groups = ingredientList.find('.wprm-recipe-ingredient-group');
    if (groups.length) {
      const groupArray = groups.toArray();
      const result = groupArray.reduce((list, element) => {
        const groupName = $(element).find('.wprm-recipe-group-name').text();
        const ingredients = $(element)
          .find('.wprm-recipe-ingredient')
          .toArray()
          .map((li) => {
            const el = $(li);
            const original = el.text();
            const { quantity } = parse(original.toLowerCase());
            return {
              ingredient: el.find('.wprm-recipe-ingredient-name').text(),
              quantity:
                quantity || el.find('.wprm-recipe-ingredient-amount').text(),
              unit: parseUnit(el.find('.wprm-recipe-ingredient-unit').text()),
              note: el.find('.wprm-recipe-ingredient-notes').text(),
              group: groupName,
              original
            };
          });
        return [...list, ...ingredients];
      }, [] as Prisma.IngredientCreateInput[]);
      return {
        ingredients: result
      };
    }
    return {
      ingredients: []
    };
  } catch (e) {
    console.info(`Couldn't parse wp recipe: ${e}`);
    return {
      ingredients: []
    };
  }
};

export default parseWpIngredients;
