import Recipe from 'types/recipes';
import { scrapeRecipe as Scrape } from '../services';
import { SCRAPE_RECIPE, RECEIVE_SCRAPE, INVALID_SCRAPE } from './types';

const scrapeRecipe = (url: string) => ({
  type: SCRAPE_RECIPE,
  scrape: url,
  fromScrape: true,
  isFetching: true,
  didInvalidate: false,
});

const receiveScrape = (json: Recipe) => ({
  type: RECEIVE_SCRAPE,
  isFetching: false,
  didInvalidate: false,
  initialState: json,
  data: json,
});

const invalidateScrape = (error: any) => ({
  type: INVALID_SCRAPE,
  fromScrape: false,
  isFetching: false,
  didInvalidate: true,
  error,
});

const fetchScrape = (url: string) => (dispatch: any) => {
  dispatch(scrapeRecipe(url));
  return Scrape(url)
    .then(data => dispatch(receiveScrape(data)))
    .catch(error => invalidateScrape(error))
}

export {
  SCRAPE_RECIPE,
  RECEIVE_SCRAPE,
  INVALID_SCRAPE,
  scrapeRecipe,
  receiveScrape,
  invalidateScrape,
  fetchScrape,
}