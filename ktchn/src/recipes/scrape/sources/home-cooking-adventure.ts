import { Recipe } from "../..";
import { RecipeDetails, ComposedIngredients } from '../../index';
import { parseIngredients } from '../index';

const SELECTORS = {
  TITLE: 'h1[itemprop="name"]',
  PREP_TIME: 'time[itemprop="prepTime"]',
  COOK_TIME: 'time[itemprop="cookTime"]',
  SERVINGS: 'span.ingheading',
  INGREDIENTS: 'div#ingredients_bg ul li',
  INSTRUCTIONS: 'div#preparation ol li',
  SUMMARY: 'span[itemprop="summary"]'
}

function getRecipeName($: CheerioSelector): string {
  return $(SELECTORS.TITLE).text();
}

function getRecipeDetails($: CheerioSelector): RecipeDetails {
  return {
    preparationTime: $(SELECTORS.PREP_TIME).attr('content'),
    cookingTime: $(SELECTORS.COOK_TIME).attr('content'),
    servings: Number($(SELECTORS.SERVINGS).text().replace(/\D/g, '')),
  }
}

function getIngredients($: CheerioSelector): ComposedIngredients[] {
  const rawData = $(SELECTORS.INGREDIENTS);
  let ingredients: ComposedIngredients[] = [{name: '', ingredients: []}];
  const isSubtitle = (element: Cheerio) => element.find('span').hasClass('ingheading');
  const removeEquivalence = (str: string): string => str.replace(/\([0-9.]+\w+\) ?/, '');

  rawData.each((index, element)=>{
    if ($(element).text().includes('Makes')) return;
    if (isSubtitle($(element))) {
      ingredients.push({
        name: $(element).text(),
        ingredients: [],
      })
    } else {
      const last = ingredients.length - 1;
      let ing = parseIngredients($(element).text());
      ingredients[last].ingredients = ingredients[last].ingredients.concat([{
        ...ing,
        name: removeEquivalence(ing.name)
      }])
    }
  })
  return ingredients;
}

function getInstructions($: CheerioSelector): string[] {
  return $(SELECTORS.INSTRUCTIONS).toArray().map(element => $(element).text().trim());
}

const HCA_CONFIG = {
  name: 'Home Cooking Adventure',
  domain: 'homecookingadventure',
  website: 'https://www.homecookingadventure.com',
  scrapeRecipe: ($: CheerioSelector): Recipe => ({
    name: getRecipeName($),
    author: { name: 'Home Cooking Adventure' },
    details: getRecipeDetails($),
    ingredients: getIngredients($),
    instructions: getInstructions($),
    summary: $(SELECTORS.SUMMARY).children().first().text().trim(),  
  }),
}

export default HCA_CONFIG;