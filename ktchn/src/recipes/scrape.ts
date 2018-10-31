import RequestPromise from "request-promise";
import Cheerio from "cheerio";
import Recipe from "./index";
import { json } from "body-parser";
import { stringify } from "querystring";
import { UriOptions } from "request";

function getIngredients($:CheerioSelector): Recipe {
  let r = new Recipe('');
  const ingredientsScrape = $('.cs-ingredients-check-list > ul').children();
  console.log(ingredientsScrape.length);

  return r;
}

function lauraInTheKitchen($:CheerioSelector):Recipe {
  let recipe = new Recipe($('.cs-page-title>h1').text().trim());
  const recipeDetails = $('.cs-recipe-details').find('div');
  
  const recipeMap = ['preparationTime', 'cookTime', 'servings'];
  recipeDetails.each((i:any, el:any) => {
    if (i > 2) return false;
    var x = $(el).contents().toArray();
    recipe = {
      ...recipe,
      [recipeMap[i]]: $(x).not('span').text().replace(/\D/g,''),
    } 
  })
  
  getIngredients($);
  return recipe;
}

function scrape(url:string) {
  const options = {
    uri: url,
    transform: (body: any) => Cheerio.load(body),
  };
  return RequestPromise(options).then(($) => {
    return lauraInTheKitchen($);
  });

}

export default scrape;