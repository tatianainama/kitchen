import { Action } from 'redux';
import { DBRecipe } from 'types/recipes';

export type RecipeState = {
  isFetching: boolean,
  data: DBRecipe[],
  selectedRecipe?: DBRecipe,
  shoppingCart: [],
  id: string,
  result: any,
  layout: Layout
};

export enum Layout {
  VerticalSplit,
  Module,
  List
}

export interface ReceiveRecipeAction extends Action<'RECEIVE_RECIPES'> {
  isFetching: boolean,
  payload: DBRecipe[]
}

export interface RequestRecipeAction extends Action<'REQUEST_RECIPES'> {
  isFetching: boolean
}

export interface SelectRecipeAction extends Action<'SELECT_RECIPE'> {
  payload: DBRecipe | undefined
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
