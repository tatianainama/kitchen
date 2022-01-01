import axios from 'axios';
import * as cheerio from 'cheerio';
import getScrapingSource from '@/utils/api/scrape/sources';

const scrape = async (url: string) => {
  const scrapingSource = getScrapingSource(url);
  if (scrapingSource) {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    try {
      console.log('scraping data');
      return scrapingSource.scrapeRecipe($);
    } catch (error) {
      console.error(
        'failed scraper',
        error
      );
    }
  }
  return 'not found';
};

export default scrape;

