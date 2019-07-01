import Recipe from 'types/recipes';
import { scrapeRecipe as Scrape } from '../services';
import { SCRAPE_RECIPE, RECEIVE_SCRAPE, INVALID_SCRAPE } from './types';

const scrapeRecipe = (url: string) => ({
  type: SCRAPE_RECIPE,
  url
});

const receiveScrape = (data: Recipe) => ({
  type: RECEIVE_SCRAPE,
  data,
});

const invalidateScrape = (error: any) => ({
  type: INVALID_SCRAPE,
  error,
});

export const fetchScrape = (url: string) => (dispatch: any) => {
  dispatch(scrapeRecipe(url));
  return Scrape(url)
    .then(data => dispatch(receiveScrape(data)))
    .catch(error => dispatch(invalidateScrape(error)))
}

const CreateFormActions = {
  fetchScrape
}

export default CreateFormActions;

export type CreateFormActionsType = typeof CreateFormActions;
