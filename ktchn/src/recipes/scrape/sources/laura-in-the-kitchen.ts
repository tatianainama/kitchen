import { Recipe, RecipeDetails, Ingredient, ComposedIngredients, Author } from '../../model';
import { parse as parseIngredient } from "recipe-ingredient-parser";

const LITK_AUTHOR_DATA: Author = {
  name: 'Laura Vitale',
  website: 'http://www.laurainthekitchen.com',
};

const SELECTORS = {
  TITLE: '.cs-page-title > h1',
  DETAILS: '.cs-recipe-details > div',
  INGREDIENTS: '.cs-ingredients-check-list > ul',
  INSTRUCTIONS: '#recipe-process > ul',
}

function getRecipeName($: CheerioSelector): string {
  return $(SELECTORS.TITLE).text().trim();
}

function getRecipeDetails($: CheerioSelector): RecipeDetails {
  const matchInt = (data: string, reg: RegExp, logic?: (s: RegExpMatchArray) => number): number => {
    let result = data.match(reg);
    return logic ? 
      (result ? logic(result) : 0) :
      (result ? parseInt(result[0]) : 0)
  };
  
  const parseTime = (data: string) => {
    let parsedHoursAsMin = matchInt(data, /(\d+) hours?/, result => parseInt(result[0])*60);
    let parsedMinutes = matchInt(data, /(\d+) minutes?/);
    return parsedHoursAsMin + parsedMinutes;
  };

  const LAURA_MAP: {
    [index:string] : {
      key: string,
      transform: (data: string) => number,
    }
  } = {
    preparationTime: {
      key: 'Preparation',
      transform: parseTime,
    },
    cookingTime: {
      key: 'Cook time',
      transform: parseTime,
    },
    servings: {
      key: 'Servings',
      transform: (data: string) => matchInt(data, /\d+/),
    }
  };

  let details = new RecipeDetails();
  const detailsKey = Object.keys(details);
  const data = $(SELECTORS.DETAILS);
  let _rawData: any = {};
  
  data.each((i, el) => {
    let key: string = $(el).find('span').text();
    _rawData[key] = $(el).contents().last().text();
  });

  return detailsKey.reduce((recipeDetails, key) => {
    let _key = LAURA_MAP[key];
    return {
      ...recipeDetails,
      [key]: _key.transform(_rawData[_key.key])
    }
  }, details);
}

function getIngredients($: CheerioSelector): ComposedIngredients[] {
  const parseIngredients = (rawIngredient: string): Ingredient => {
    let parsed = parseIngredient(rawIngredient);
    return {
      name: parsed.ingredient,
      quantity: Number(parsed.quantity) || 0,
      unit: parsed.unit || '',
      _original: rawIngredient,
    };
  };
  const ingredientsScrape = $(SELECTORS.INGREDIENTS).children();
  const isNewIngredientList = (tagName: string): boolean => tagName === 'span';
  
  let ingredients: ComposedIngredients[] = [];

  return ingredientsScrape.toArray().reduce((list, rawIngredient)=>{
    let last = list.length - 1;
    let text = $(rawIngredient).text();
    if (isNewIngredientList(rawIngredient.tagName)) {
      return list.concat([{name: text, ingredients: []}]);
    } else {
      list[last].ingredients = list[last].ingredients.concat([parseIngredients(text)]);
      return list;
    }
  }, ingredients);
}

function getInstructions($: CheerioSelector): string[] {
  const data = $(SELECTORS.INSTRUCTIONS).text();
  return data.split('\n').filter(s => s !== '').map(s => s.trim().replace(/^\d\)\s*/, ''));
}

const LITK_CONFIG = {
  name: 'Laura in the Kitchen',
  domain: 'laurainthekitchen',
  website: LITK_AUTHOR_DATA.website,
  scrapeRecipe: ($: CheerioSelector): Recipe => ({
    name: getRecipeName($),
    author: LITK_AUTHOR_DATA,
    details: getRecipeDetails($),
    ingredients: getIngredients($),
    instructions: getInstructions($),
  })
}

export default LITK_CONFIG;