import { CreateState, CreateActionTypes, SCRAPE_RECIPE, RECEIVE_SCRAPE, INVALID_SCRAPE } from './types';

const initialState: CreateState = {
  data: {},
  initialState: {},
  fromScrape: false,
  fetchingScrape: false,
  invalidScrape: false,
};

export const createReducer = (
  state = initialState,
  action: CreateActionTypes
): CreateState => {
  switch (action.type) {
    case SCRAPE_RECIPE:
      return {
        ...state,
        fromScrape: true,
        fetchingScrape: true,
        invalidScrape: false,
      }
    case RECEIVE_SCRAPE:
      return {
        ...state,
        fetchingScrape: false,
        data: action.data,
        initialState: action.data,
        invalidScrape: false,
      }
    case INVALID_SCRAPE:
      return {
        ...state,
        fetchingScrape: false,
        invalidScrape: true,
        fromScrape: false
      }
    default:
      return state
  }
};