import axios from 'axios';
import Recipe from 'types/recipes';
import { getRecipes } from '../services';

export const RECEIVE_RECIPES = 'RECEIVE_RECIPES';
export const REQUEST_RECIPES = 'REQUEST_RECIPES';
export const SELECT_RECIPE = 'SELECT_RECIPE';

export const requestRecipes = (query: string) => ({
  type: REQUEST_RECIPES,
  isFetching: true,
});

export const receiveRecipes = (json: Recipe[]) => ({
  type: RECEIVE_RECIPES,
  isFetching: false,
  payload: json,
});

export const selectRecipe = (recipe?: Recipe) => ({
  type: SELECT_RECIPE,
  payload: recipe,
});

export function fetchRecipes(query: string) {
  return (dispatch: any) => {
    dispatch(requestRecipes(query))
    return getRecipes(query)
    .then(data => dispatch(receiveRecipes(data)))
    .catch(error => {
      console.log('error', error);
    })
  }
}

function shouldFetch(recipes: Recipe[]) {
  return recipes.length ? false : true;
}

export function fetchIfNeeded(query: string) {
  return (dispatch: any, getState: any) => {
    if(shouldFetch(getState())) {
      return dispatch(fetchRecipes(query))
    } else {
      return Promise.resolve();
    }

  }
}