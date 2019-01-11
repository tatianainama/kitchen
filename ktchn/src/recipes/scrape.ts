import RequestPromise from "request-promise";
import Cheerio from "cheerio";
import { Recipe, RecipeDetails } from './index';
import { json } from "body-parser";
import { stringify } from "querystring";
import { UriOptions } from "request";
import { any } from "bluebird";

const LAURA_MAP = {
  'Preparation': {
    key: 'preparationTime',
    transform: (data: string) => {
      let getHoursAsMin = (data: string) => {
        let result = data.match(/(\d+) hours?/);
        return result ? (parseInt(result[0])*60) : 0;
      };
      let getMinutes = (data: string) => {
        let result = data.match(/(\d+) minutes?/);
        return result ? parseInt(result[0]) : 0;
      };
      return getHoursAsMin(data) + getMinutes(data);
    },
  },
  'Cook time': {
    key: 'cookTime',
    transform: (data: string) => data,
  },
  'Servings': {
    key: 'servings',
    transform: (data: string) => data,
  }
};

function getIngredients($:CheerioSelector): Recipe {
  let r = new Recipe('');
  const ingredientsScrape = $('.cs-ingredients-check-list > ul').children();
  //console.log(ingredientsScrape.length);

  return r;
}

function getRecipeDetails($:CheerioSelector):RecipeDetails {
  let details = new RecipeDetails();
  const detailsMap = Object.keys(details);
  const data = $('.cs-recipe-details').find('div');
  let x: any = {};
  data.each((i, el) => {
    let key: string = $(el).find('span').text();
    x[key] = $(el).contents().last().text();
  });
  console.log(LAURA_MAP.Preparation.transform(x.Preparation));
  
  return details;
}

function lauraInTheKitchen($:CheerioSelector):Recipe {
  let recipe = new Recipe($('.cs-page-title>h1').text().trim());
  const recipeDetails = $('.cs-recipe-details').find('div');
  
  const recipeMap = ['preparationTime', 'cookTime', 'servings'];
  getRecipeDetails($);
  recipeDetails.each((i:any, el:any) => {
    if (i > (recipeMap.length-1)) return false;
    var x = $(el).contents().toArray();
    //console.log($(x).text());
    recipe = {
      ...recipe,
      [recipeMap[i]]: $(x).not('span').text().replace(/\D/g,''),
    };
  })
  
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