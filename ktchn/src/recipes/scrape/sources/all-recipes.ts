import { Recipe, Author, RecipeDetails, ComposedIngredients } from '../../index';
import { parseIngredients } from '../index';

const SELECTORS = {
  PREP_TIME: 'time[itemprop="prepTime"]',
  COOK_TIME: 'time[itemprop="cookTime"]',
  SERVINGS: 'meta#metaRecipeServings',
  INGREDIENTS: 'div#polaris-app',
  INSTRUCTIONS: 'li.step',
  SUMMARY: 'meta#metaDescription',
  TAGS: 'meta[itemprop="recipeCategory"]',
}

function getRecipeName($: CheerioSelector): string {
  return $('h1#recipe-main-content').text();
}

function getAuthorData($: CheerioSelector): Author {
  return {
    name: $('span.submitter__name').text(),
  };
}

function getRecipeDetails($: CheerioSelector): RecipeDetails {
  return {
    preparationTime: $(SELECTORS.PREP_TIME).attr('datetime'),
    cookingTime: $(SELECTORS.COOK_TIME).attr('datetime'),
    servings: Number($(SELECTORS.SERVINGS).attr('content')),
  };
}

function getIngredients($: CheerioSelector): ComposedIngredients[] {
  const rawData = $(SELECTORS.INGREDIENTS).find('li.checkList__line');
  const isSubtitle = (element: Cheerio) => element.find('input').data('id') === 0;
  let ingredients: ComposedIngredients[] = [{
    name: '',
    ingredients: [],
  }];
  rawData.each((i, element)=> {
    const label = $(element).find('label');
    if (label.attr('title')) { // matches items with ingredients
      if (isSubtitle(label)) {
        ingredients.push({
          name: label.text().trim(),
          ingredients: [],
        });
      } else {
        const last = ingredients.length - 1;
        ingredients[last].ingredients = ingredients[last].ingredients.concat([parseIngredients(label.text().trim())])
      }
    }
  })
  return ingredients;
}

function getInstructions($: CheerioSelector): string[] {
  return $(SELECTORS.INSTRUCTIONS).toArray().map(element => $(element).text().trim());
}

const getTextList = (SELECTOR: string) => ($: CheerioSelector): string[] => $(SELECTOR).map((i, e) => $(e).text().trim()).get()

const AR_CONFIG = {
  name: 'All Recipes',
  domain: 'allrecipes',
  website: 'https://www.allrecipes.com',
  scrapeRecipe: ($: CheerioSelector): Recipe => ({
    name: getRecipeName($),
    author: getAuthorData($),
    details: getRecipeDetails($),
    ingredients: getIngredients($),
    instructions: getTextList(SELECTORS.INSTRUCTIONS)($),
    tags: $(SELECTORS.TAGS).map((i, e) => $(e).attr('content')).get(),
    summary: $(SELECTORS.SUMMARY).attr('content'),
  }),
}

export default AR_CONFIG;