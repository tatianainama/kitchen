import scrape from '@/utils/api/scrape';
import { inputs, outputs } from './data';

test.each(inputs)('Scrapes pages correctly', async (url) => {
  const scrapedRecipe = await scrape(url);

  const output = outputs[url];

  expect(scrapedRecipe).toStrictEqual(output);
});
