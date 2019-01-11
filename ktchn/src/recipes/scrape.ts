import RequestPromise from "request-promise";
import Cheerio from "cheerio";
import { Recipe, RecipeDetails } from './index';
import { json } from "body-parser";
import { stringify } from "querystring";
import { UriOptions } from "request";
import { any } from "bluebird";
import { Transform } from "stream";

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

function getIngredients($:CheerioSelector): Recipe {
  let r = new Recipe('');
  const ingredientsScrape = $('.cs-ingredients-check-list > ul').children();
  return r;
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

function lauraInTheKitchen($:CheerioSelector):Recipe {
  let recipe = new Recipe(
    getRecipeName($),
    getRecipeDetails($)
  );
  console.log(recipe);
  getIngredients($);
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