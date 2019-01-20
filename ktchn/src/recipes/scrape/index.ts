import RequestPromise from "request-promise";
import Cheerio from "cheerio";
import Sources from './sources';
import { ScrapingSource } from './sources/index';
import { Ingredient } from '../index';
import { parse as parseIngredient } from 'recipe-ingredient-parser';

function selectSource(url: string): ScrapingSource|void {
  return Sources.find((source) => {
    return url.search(source.domain) > 0;
  });
}

export const parseIngredients = (rawIngredient: string): Ingredient => {
  let parsed = parseIngredient(rawIngredient);
  return {
    name: parsed.ingredient,
    quantity: Number(parsed.quantity) || 0,
    unit: parsed.unit || '',
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
  const $ = await RequestPromise(options);
  let source = selectSource(url);
  return source ? source.scrapeRecipe($) : new Error('source not found');

}

export default scrape;