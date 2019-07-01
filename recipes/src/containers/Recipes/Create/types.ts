import Recipe from "src/types/recipes";

export const SCRAPE_RECIPE = 'SCRAPE_RECIPE';
export const RECEIVE_SCRAPE = 'RECEIVE_SCRAPE';
export const INVALID_SCRAPE = 'INVALID_SCRAPE';
export const UPDATE_FIELD = 'UPDATE_FIELD';
export const ADD_SUBRECIPE = 'ADD_SUBRECIPE';
export const REMOVE_SUBRECIPE = 'REMOVE_SUBRECIPE';
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const REMOVE_INGREDIENT = 'REMOVE_INGREDIENT';
export const ADD_SUGGESTION = 'ADD_SUGGESTION';
export const SELECT_SUGGESTION = 'SELECT_SUGGESTION';

interface ScrapeRecipeAction {
  type: typeof SCRAPE_RECIPE,
  url: string
}

interface ReceiveScrapeAction {
  type: typeof RECEIVE_SCRAPE,
  data: Recipe,
}

interface InvalidScrapeAction {
  type: typeof INVALID_SCRAPE,
  error: any
}

export interface CreateState {
  data: Recipe|{},
  initialState: Recipe|{},
  fromScrape: boolean,
  scrapeUrl: string|null,
  fetchingScrape: boolean,
  invalidScrape: boolean
}

export type CreateActionTypes = ScrapeRecipeAction | ReceiveScrapeAction | InvalidScrapeAction;