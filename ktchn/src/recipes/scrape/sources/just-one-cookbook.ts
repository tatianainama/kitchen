import { Recipe, IIngredient } from "../../model";
import { RecipeDetails, ISubRecipe } from '../../model';
import { parseIngredients } from '../index';
import { getText, getTextList, rmEquivalence } from './../service';
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
  COURSE: 'span.wprm-recipe-course',
  IMAGE: 'div.wprm-recipe-image img',
  VIDEO: 'div.video-container'
}

const getRecipeName = ($: CheerioSelector): string => {
  return $(SELECTORS.TITLE).text();
}

const getRecipeDetails = ($: CheerioSelector): RecipeDetails => {
  return {
    preparationTime: $(SELECTORS.PREP_TIME).text(),
    cookingTime: $(SELECTORS.COOK_TIME).text(),
    servings: Number($(SELECTORS.SERVINGS).text()),
    video: $(SELECTORS.VIDEO).children()[0].attribs['data-l-src'] || ''
  }
};

const getIngredients = ($: CheerioSelector): ISubRecipe[] => {
  let ingredients: ISubRecipe[] = [{name: '', ingredients: []}];
  const rawData = $(SELECTORS.INGREDIENTS);
  const cleanName = (element: CheerioElement, not: string): string => $(element).children().not(not).toArray().map(x => $(x).text()).join(' ');
  rawData.each((i, element) => {
    const last = ingredients.length - 1;
    const getIngredients = (li: Cheerio): IIngredient[] => li.toArray().map(el => ({
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

const JOC_CONFIG = {
  name: 'Just One Cookbook',
  domain: 'justonecookbook',
  website: 'https://www.justonecookbook.com',
  scrapeRecipe: ($: CheerioSelector): Recipe => ({
    name: getText($)(SELECTORS.TITLE),
    author: { name: 'Nami', website: 'https://www.justonecookbook.com' },
    details: getRecipeDetails($),
    ingredients: getIngredients($),
    instructions: getTextList($)(SELECTORS.INSTRUCTIONS),
    tags: (getText($)(SELECTORS.TAGS)).split(',').map(R.trim),
    course: [getText($)(SELECTORS.COURSE)],
    summary: getText($)(SELECTORS.SUMMARY),
    image: $(SELECTORS.IMAGE).attr('nitro-lazy-src')
  })
}

export default JOC_CONFIG;