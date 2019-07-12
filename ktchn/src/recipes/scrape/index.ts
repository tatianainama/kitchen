import RequestPromise from "request-promise";
import Cheerio from "cheerio";
import Sources from './sources';
import { ScrapingSource } from './sources/index';
import { IIngredient } from '../model';
import { parse as parseIngredient } from 'recipe-ingredient-parser';
import { units } from './service';

function selectSourceAsync(url: string): Promise<ScrapingSource> {
  const foundSource = Sources.find((source) => {
    return url.search(source.domain) > 0;
  });
  return new Promise((resolve, reject) => {
    if (foundSource) {
      return resolve(foundSource);
    } else {
      reject(new Error('Source not found'))
    }
  });
}

export const parseIngredients = (rawIngredient: string): IIngredient => {
  let parsed = parseIngredient(rawIngredient);
  return {
    name: parsed.ingredient,
    quantity: Number(parsed.quantity) || 0,
    unit: units(parsed.unit),
    _original: rawIngredient,
  };
};

async function scrape(url:string) {
  const options = {
    uri: url,
    transform: (body: any) => Cheerio.load(body, {
      normalizeWhitespace: true
    }),
  };
  return RequestPromise(options).then(
    $ => selectSourceAsync(url).then(
      source => {
        const recipe = source.scrapeRecipe($);
        const cleanIngredients = recipe.ingredients.filter(subRecipe => {
          return subRecipe.name !== '' && subRecipe.ingredients.length !== 0;
        })
        return {
          ...recipe,
          ingredients: cleanIngredients,
        };
      }
    )
  )
}

export default scrape;