import axios from 'axios';
import * as cheerio from 'cheerio';
import getScrapingSource from '@/utils/api/scrape/sources';
import { ScrapedRecipe } from '@/types/scraper';

const scrape = async (url: string): Promise<ScrapedRecipe> => {
  const scrapingSource = getScrapingSource(url);
  if (scrapingSource) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    return scrapingSource.scrapeRecipe($);
  }
  throw new Error('Scrapping source not found');
};

export default scrape;

