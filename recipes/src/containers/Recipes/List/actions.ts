import { ThunkAction } from 'redux-thunk';
import Recipe from 'types/recipes';
import { Layout } from 'types/ui';
import { getRecipes, deleteRecipe } from '../services';
import { Action, ActionCreator, Dispatch } from 'redux';

export const RECEIVE_RECIPES = 'RECEIVE_RECIPES';
export const REQUEST_RECIPES = 'REQUEST_RECIPES';
export const SELECT_RECIPE = 'SELECT_RECIPE';

export const DELETE_RECIPE = 'DELETE_RECIPE';
export const CONFIRM_DELETE_RECIPE = 'CONFIRM_DELETE_RECIPE';
export const REJECT_DELETE_RECIPE = 'REJECT_DELETE_RECIPE';

export const CHANGE_LAYOUT = 'CHANGE_LAYOUT';

export interface ReceiveRecipeAction extends Action<'RECEIVE_RECIPES'> {
  isFetching: boolean,
  payload: Recipe[]
}

export interface RequestRecipeAction extends Action<'REQUEST_RECIPES'> {
  isFetching: boolean
}

export interface SelectRecipeAction extends Action<'SELECT_RECIPE'> {
  payload: Recipe
}

export interface DeleteRecipeAction extends Action<'DELETE_RECIPE'> {
  id: string,
}

export interface ResultDeleteRecipeAction extends Action<'CONFIRM_DELETE_RECIPE'|'REJECT_DELETE_RECIPE'> {
  result: any
}

export interface ChangeLayoutAction extends Action<'CHANGE_LAYOUT'> {
  layout: Layout
}

export type RecipeListActionTypes =
  ReceiveRecipeAction |
  RequestRecipeAction |
  SelectRecipeAction |
  DeleteRecipeAction |
  ResultDeleteRecipeAction |
  ChangeLayoutAction;

export const requestRecipes = (query: string): RecipeListActionTypes => ({
  type: REQUEST_RECIPES,
  isFetching: true,
});

export const receiveRecipes = (json: Recipe[]): RecipeListActionTypes => ({
  type: RECEIVE_RECIPES,
  isFetching: false,
  payload: json,
});

export const selectRecipe = (recipe: Recipe): RecipeListActionTypes => ({
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
