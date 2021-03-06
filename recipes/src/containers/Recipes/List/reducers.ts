
import { RECEIVE_RECIPES, SELECT_RECIPE, REQUEST_RECIPES, DELETE_RECIPE, CONFIRM_DELETE_RECIPE, REJECT_DELETE_RECIPE, CHANGE_LAYOUT } from './actions';
import { RecipeState, Layout, RecipeListActionTypes } from './types';

const initialState: RecipeState = {
  isFetching: false,
  data: [],
  selectedRecipe: undefined,
  shoppingCart: [],
  id: '',
  result: undefined,
  layout: Layout.List
};

export const recipesReducer = (
  state = initialState,
  action: RecipeListActionTypes
): RecipeState => {
  switch (action.type) {
    case REQUEST_RECIPES: 
      return {
        ...state,
        isFetching: action.isFetching,
      }
    case RECEIVE_RECIPES:
      return {
        ...state,
        isFetching: action.isFetching,
        data: action.payload || state.data,
      }
    case SELECT_RECIPE:
      return {
        ...state,
        selectedRecipe: action.payload
      }
    case DELETE_RECIPE:
      return {
        ...state,
        id: action.id,
        isFetching: true
      }
    case CONFIRM_DELETE_RECIPE:
      return {
        ...state,
        isFetching: false,
        id: '',
        result: action.result
      }
    case REJECT_DELETE_RECIPE:
      return {
        ...state,
        isFetching: false,
        id: '',
        result: action.result
      }
    case CHANGE_LAYOUT:
      return {
        ...state,
        layout: action.layout
      }
    default:
      return state;
  }
}