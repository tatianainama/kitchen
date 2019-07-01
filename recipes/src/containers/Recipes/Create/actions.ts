import Recipe from 'types/recipes';
import { scrapeRecipe as Scrape } from '../services';
import { SCRAPE_RECIPE, RECEIVE_SCRAPE, INVALID_SCRAPE } from './types';
import { bindActionCreators } from 'redux';

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

export const fetchScrape = (url: string) => (dispatch: any) => {
  console.log("fetching");
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
