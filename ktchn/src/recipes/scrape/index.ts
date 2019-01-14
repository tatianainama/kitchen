import RequestPromise from "request-promise";
import Cheerio from "cheerio";
import Sources from './sources';
import { ScrapingSource } from './sources/index';

function selectSource(url: string): ScrapingSource|void {
  return Sources.find((source) => {
    return url.search(source.domain) > 0;
  });
}

function scrape(url:string) {
  const options = {
    uri: url,
    transform: (body: any) => Cheerio.load(body, {
      normalizeWhitespace: true
    }),
  };
  return RequestPromise(options).then(($) => {
    let source = selectSource(url);
    return source ? source.scrapeRecipe($) : new Error('source not found');
  });

}

export default scrape;