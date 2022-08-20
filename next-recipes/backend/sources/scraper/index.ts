import { parseWpIngredients } from './parser/wpIngredients';
import { RecipeTypes } from 'additional';
import axios from 'axios';
import * as cheerio from 'cheerio';
import getScrapingSource from 'backend/sources/scraper/sources';
import { parseFromJsonLd } from './parser/recipe';

const scrape = async (url: string): Promise<RecipeTypes.ScrapedRecipe> => {
  const response = await axios.get(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36'
    }
  });
  const $ = cheerio.load(response.data);
  const recipeUrl = new URL(url);
  const jsonLdData = parseFromJsonLd($);
  const scrapingSource = getScrapingSource(url);
  const isWpRecipe = !!$('.wprm-recipe').length;

  if (!jsonLdData?.name && !scrapingSource && !isWpRecipe) {
    throw Error(`Couldn't scrape recipe from url: ${url}`);
  }

  return {
    url,
    author: {
      ...(jsonLdData.author || {}),
      website: recipeUrl.origin
    },
    ...jsonLdData,
    ...(scrapingSource ? scrapingSource.scrapeRecipe($) : {}),
    ...(isWpRecipe ? parseWpIngredients($) : {})
  };
};

export default scrape;
