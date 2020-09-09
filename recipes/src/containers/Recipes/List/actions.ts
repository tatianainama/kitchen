import { ThunkAction } from 'redux-thunk';
import Recipe from 'types/recipes';
import { getRecipes, deleteRecipe } from '../services';
import { Action, ActionCreator, Dispatch } from 'redux';

export const RECEIVE_RECIPES = 'RECEIVE_RECIPES';
export const REQUEST_RECIPES = 'REQUEST_RECIPES';
export const SELECT_RECIPE = 'SELECT_RECIPE';

export const DELETE_RECIPE = 'DELETE_RECIPE';
export const CONFIRM_DELETE_RECIPE = 'CONFIRM_DELETE_RECIPE';
export const REJECT_DELETE_RECIPE = 'REJECT_DELETE_RECIPE';

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

export interface DeleteRecipeAction extends Action<'DELETE_RECIPE'> {
  id: string,
}

export const pendingDeleteRecipe = (id: string): DeleteRecipeAction => ({
  type: DELETE_RECIPE,
  id,
})

export interface ResultDeleteRecipeAction extends Action<'CONFIRM_DELETE_RECIPE'|'REJECT_DELETE_RECIPE'> {
  result: any
}

export const confirmDeleteRecipe = (result: any): ResultDeleteRecipeAction => ({
  type: CONFIRM_DELETE_RECIPE,
  result,
});

export const rejectDeleteRecipe = (result: any): ResultDeleteRecipeAction => ({
  type: REJECT_DELETE_RECIPE,
  result,
})

export const deleteRecipeActionCreator: ActionCreator<
  ThunkAction<
    Promise<ResultDeleteRecipeAction>,
    any,
    any,
    ResultDeleteRecipeAction
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