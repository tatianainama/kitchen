import { Recipe, Ingredient } from "../..";
import { RecipeDetails, ComposedIngredients } from '../../index';
import { parseIngredients } from '../index';
import R from 'ramda';

const SELECTORS = {
  TITLE: 'div.wprm-recipe-name',
  PREP_TIME: 'span.wprm-recipe-prep_time-minutes',
  COOK_TIME: 'span.wprm-recipe-cook_time-minutes',
  SERVINGS: 'span.wprm-recipe-servings',
  INGREDIENTS: 'div.wprm-recipe-ingredient-group',
  ING: {
    AMOUNT: 'span.wprm-recipe-ingredient-amount',
    UNIT: 'span.wprm-recipe-ingredient-unit',
    NAME: 'span.wprm-recipe-ingredient-name',
    NOTE: 'span.wprm-recipe-ingredient-notes'
  },
  SUB_RECIPE: 'div.wprm-recipe-ingredient-group-name',
  SUB_INGREDIENTS: 'li.wprm-recipe-ingredient',
  INSTRUCTIONS: 'div.wprm-recipe-instruction-text',
  TAGS: 'span.wprm-recipe-keyword',
  SUMMARY: 'div.wprm-recipe-summary',
  COURSE: 'span.wprm-recipe-course'
}

const getRecipeName = ($: CheerioSelector): string => {
  return $(SELECTORS.TITLE).text();
}

const getRecipeDetails = ($: CheerioSelector): RecipeDetails => {
  return {
    preparationTime: $(SELECTORS.PREP_TIME).text(),
    cookingTime: $(SELECTORS.COOK_TIME).text(),
    servings: $(SELECTORS.SERVINGS).text(),
  }
};

const getIngredients = ($: CheerioSelector): ComposedIngredients[] => {
  let ingredients: ComposedIngredients[] = [{name: '', ingredients: []}];
  const rawData = $(SELECTORS.INGREDIENTS);
  const removeEquivalence = (str: string): string => str.replace(/(\([0-9.]+ \w+\))|(\([0-9.]+ \w+\/[0-9.]+ \w+\))/, '');
  const getString = (element: CheerioElement, selector: string): string => $(element).find(selector).text();
  const cleanName = (element: CheerioElement, not: string): string => $(element).children().not(not).toArray().map(x => $(x).text()).join(' ');
  rawData.each((i, element) => {
    const last = ingredients.length - 1;
    const getIngredients = (li: Cheerio): Ingredient[] => li.toArray().map(el => ({
      ...parseIngredients(cleanName(el, SELECTORS.ING.NOTE)),
      note: $(el).find(SELECTORS.ING.NOTE).text(),
      _original: $(el).text().trim(),
    }));

    let subRecipe = $(element).find(SELECTORS.SUB_RECIPE);
    let subIngredients = $(element).find(SELECTORS.SUB_INGREDIENTS);

    if (subRecipe.contents().length) {
      ingredients.push({
        name: subRecipe.text(),
        ingredients: getIngredients(subIngredients),
      })
    } else {
      ingredients[last].ingredients = getIngredients(subIngredients);
    }
  })
  return ingredients;
}

const getTextList = (SELECTOR: string) => ($: CheerioSelector): string[] => $(SELECTOR).map((i, e) => $(e).text()).get()
const getText = (SELECTOR: string) => ($: CheerioSelector): string => $(SELECTOR).text().trim();

const JOC_CONFIG = {
  name: 'Just One Cookbook',
  domain: 'justonecookbook',
  website: 'https://www.justonecookbook.com',
  scrapeRecipe: ($: CheerioSelector): Recipe => new Recipe(
    getRecipeName($),
    {
      name: 'Nami',
    },
    getRecipeDetails($),
    getIngredients($),
    getTextList(SELECTORS.INSTRUCTIONS)($),
    (getText(SELECTORS.TAGS)($)).split(',').map(R.trim),
    [getText(SELECTORS.COURSE)($)],
    getText(SELECTORS.SUMMARY)($),
  )
}

export default JOC_CONFIG;