// import { Dispatch } from "react";
import axios from 'axios';

export const RECEIVE_RECIPES = 'RECEIVE_RECIPES';
export const REQUEST_RECIPES = 'REQUEST_RECIPES';

export const requestRecipes = (query: {}) => ({
  type: REQUEST_RECIPES,
  isFetching: true,
});

export const receiveRecipes = (json: []) => ({
  type: RECEIVE_RECIPES,
  isFetching: false,
  payload: json,
});

export function fetchRecipes(query: any) {
  return (dispatch: any) => {
    dispatch(requestRecipes(query))
    return axios.get('https://recipes.davidventura.com.ar/recipes/all')
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
