import { Recipe } from "../../model";
import { RecipeDetails, ISubRecipe } from '../../model';
import { parseIngredients } from '../index';

const SELECTORS = {
  TITLE: 'h1[itemprop="name"]',
  PREP_TIME: 'time[itemprop="prepTime"]',
  COOK_TIME: 'time[itemprop="cookTime"]',
  VIDEO: 'div#subtitle iframe',
  SERVINGS: 'span.ingheading',
  INGREDIENTS: 'div#ingredients_bg ul li',
  INSTRUCTIONS: 'div#preparation ol li',
  SUMMARY: 'span[itemprop="summary"]',
  IMAGE: 'div#main_img img'
}

function getRecipeName($: CheerioSelector): string {
  return $(SELECTORS.TITLE).text();
}

function getRecipeDetails($: CheerioSelector): RecipeDetails {
  return {
    preparationTime: $(SELECTORS.PREP_TIME).attr('content') || '',
    cookingTime: $(SELECTORS.COOK_TIME).attr('content') || '',
    servings: Number($(SELECTORS.SERVINGS).text().replace(/\D/g, '')),
    video: ($(SELECTORS.VIDEO).attr('src') || '').replace('//', '') || '',
  }
}

function getIngredients($: CheerioSelector): ISubRecipe[] {
  const rawData = $(SELECTORS.INGREDIENTS);
  let ingredients: ISubRecipe[] = [{name: '', ingredients: []}];
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
    author: { name: 'Home Cooking Adventure', website: 'https://www.homecookingadventure.com' },
    details: getRecipeDetails($),
    ingredients: getIngredients($),
    instructions: getInstructions($),
    summary: $(SELECTORS.SUMMARY).children().first().text().trim(),  
    image: `https://www.homecookingadventure.com${$(SELECTORS.IMAGE).attr('src')}`,
  }),
}

export default HCA_CONFIG;