// import { Dispatch } from "react";
import axios from 'axios';

export const RECEIVE_RECIPES = 'RECEIVE_RECIPES';
export const REQUEST_RECIPES = 'REQUEST_RECIPES';
export const SELECT_RECIPE = 'SELECT_RECIPE';

export const requestRecipes = (query: {}) => ({
  type: REQUEST_RECIPES,
  isFetching: true,
});

export const receiveRecipes = (json: []) => ({
  type: RECEIVE_RECIPES,
  isFetching: false,
  payload: json,
});

export const selectRecipe = (recipe: any) => ({
  type: SELECT_RECIPE,
  payload: recipe,
});

export function fetchRecipes(query: any) {
  return (dispatch: any) => {
    dispatch(requestRecipes(query))
    return axios.get('http://localhost:3000/recipes/all')
    .then(response => {
      console.log('response', response.data);
      return response.data
    })
    .then(json => dispatch(receiveRecipes(json)))
    .catch(error => {
      console.log('error', error);
    })
  }
}

function shouldFetch(recipes: []) {
  return recipes.length ? false : true;
}

export function fetchIfNeeded(query: any) {
  return (dispatch: any, getState: any) => {
    if(shouldFetch(getState())) {
      return dispatch(fetchRecipes(query))
    } else {
      return Promise.resolve();
    }

  }
}