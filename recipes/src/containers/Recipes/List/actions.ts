import { ThunkAction } from 'redux-thunk';
import { DBRecipe } from 'types/recipes';
import { getRecipes, deleteRecipe } from '../services';
import { ActionCreator, Dispatch } from 'redux';
import { RecipeListActionTypes, Layout } from './types';

export const RECEIVE_RECIPES = 'RECEIVE_RECIPES';
export const REQUEST_RECIPES = 'REQUEST_RECIPES';
export const SELECT_RECIPE = 'SELECT_RECIPE';

export const DELETE_RECIPE = 'DELETE_RECIPE';
export const CONFIRM_DELETE_RECIPE = 'CONFIRM_DELETE_RECIPE';
export const REJECT_DELETE_RECIPE = 'REJECT_DELETE_RECIPE';

export const CHANGE_LAYOUT = 'CHANGE_LAYOUT';

export const requestRecipes = (query: string): RecipeListActionTypes => ({
  type: REQUEST_RECIPES,
  isFetching: true,
});

export const receiveRecipes = (json: DBRecipe[]): RecipeListActionTypes => ({
  type: RECEIVE_RECIPES,
  isFetching: false,
  payload: json,
});

export const selectRecipe = (recipe?: DBRecipe): RecipeListActionTypes => ({
  type: SELECT_RECIPE,
  payload: recipe,
});

export const pendingDeleteRecipe = (id: string): RecipeListActionTypes => ({
  type: DELETE_RECIPE,
  id,
})

export const confirmDeleteRecipe = (result: any): RecipeListActionTypes => ({
  type: CONFIRM_DELETE_RECIPE,
  result,
});

export const rejectDeleteRecipe = (result: any): RecipeListActionTypes => ({
  type: REJECT_DELETE_RECIPE,
  result,
})

export const changeLayout = (layout: Layout): RecipeListActionTypes => ({
  type: CHANGE_LAYOUT,
  layout
})

export const deleteRecipeActionCreator: ActionCreator<
  ThunkAction<
    Promise<RecipeListActionTypes>,
    any,
    any,
    RecipeListActionTypes
  >
> = (id: string) => {
  return async (dispatch: Dispatch) => {
    dispatch(pendingDeleteRecipe(id))
    try {
      const result = await deleteRecipe(id);
      fetchRecipes('')(dispatch)
      return dispatch(confirmDeleteRecipe(result))
    } catch (error) {
      return dispatch(rejectDeleteRecipe(error))
    }
  }
}

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

function shouldFetch(recipes: DBRecipe[]) {
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
