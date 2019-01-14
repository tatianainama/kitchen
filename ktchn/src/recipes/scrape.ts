import RequestPromise from "request-promise";
import Cheerio from "cheerio";
import { Recipe, RecipeDetails, Ingredient, ComposedIngredients } from './index';
import { parse } from "recipe-ingredient-parser";

type RegexMutator = (s: RegExpMatchArray) => number;

const matchInt = (data: string, reg: RegExp, logic?: RegexMutator): number => {
  let result = data.match(reg);
  return logic ? 
    (result ? logic(result) : 0) :
    (result ? parseInt(result[0]) : 0)
}

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

function parseIngredients(rawIngredient: string): Ingredient {
  let parsed = parse(rawIngredient);
  return {
    name: parsed.ingredient,
    quantity: Number(parsed.quantity) || 0,
    unit: parsed.unit || '',
    _original: rawIngredient,
  };
}

function getIngredients($:CheerioSelector): ComposedIngredients[] {
  const ingredientsScrape = $('.cs-ingredients-check-list > ul').children();
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

function getRecipeDetails($:CheerioSelector):RecipeDetails {
  let details = new RecipeDetails();
  const detailsKey = Object.keys(details);
  const data = $('.cs-recipe-details').find('div');
  let x: any = {};
  data.each((i, el) => {
    let key: string = $(el).find('span').text();
    x[key] = $(el).contents().last().text();
  });

  return detailsKey.reduce((recipeDetails, key) => {
    let _key = LAURA_MAP[key];
    return {
      ...recipeDetails,
      [key]: _key.transform(x[_key.key])
    }
  }, details);
}

function getRecipeName($:CheerioSelector): string {
  return $('.cs-page-title>h1').text().trim();
}

function getInstructions($:CheerioSelector): string[] {
  const data = $('#recipe-process').find('ul').text();
  return data.split('\n').filter(s => s !== '').map(s => s.trim().replace(/^\d\)\s*/, ''));
}

function lauraInTheKitchen($:CheerioSelector):Recipe {
  let recipe = new Recipe(
    getRecipeName($),
    getRecipeDetails($),
    getIngredients($),
    getInstructions($),
  );
  return recipe;
}

function scrape(url:string) {
  const options = {
    uri: url,
    transform: (body: any) => Cheerio.load(body, {
      normalizeWhitespace: true
    }),
  };
  return RequestPromise(options).then(($) => {
    return lauraInTheKitchen($);
  });

}

export default scrape;