import { RecipeTypes } from 'additional';
import axios from 'axios';
import * as cheerio from 'cheerio';
import getScrapingSource from '@/utils/api/scrape/sources';
import { parseFromJsonLd } from './parser/recipe';

const scrape = async (url: string): Promise<RecipeTypes.ScrapedRecipe> => {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  const jsonLdData = parseFromJsonLd($);
  const scrapingSource = getScrapingSource(url);

  if (!jsonLdData && !scrapingSource) {
    throw Error(`Couldn't scrape recipe from url: ${url}`);
  }

  return scrapingSource
    ? { ...jsonLdData,
      ...scrapingSource.scrapeRecipe($) }
    : jsonLdData;

};

export default scrape;

