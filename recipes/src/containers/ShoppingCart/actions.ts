import { DBRecipe } from 'types/recipes';
import ShoppingItem from 'types/shopping-cart';
import { bindActionCreators } from 'redux';

export const ADD_RECIPE_TO_CART = 'ADD_ RECIPE_TO_CART';
export const REMOVE_RECIPE_FROM_CART = 'REMOVE_RECIPE_FROM_CART';
export const REMOVE_ITEM_FROM_CART = 'REMOVE_ITEM_FROM_CART';
export const REMOVE_ALL = 'REMOVE_ALL';

export const addRecipeToCart = (recipe: DBRecipe): AddRecipeToCart => ({
  type: ADD_RECIPE_TO_CART,
  payload: recipe
})

export const removeFromCart = (recipe: DBRecipe): RemoveRecipeFromCart => ({
  type: REMOVE_RECIPE_FROM_CART,
  payload: recipe._id
})

export const removeItemFromCart = (id: string): RemoveItemFromCart => ({
  type: REMOVE_ITEM_FROM_CART,
  payload: id
})

export const removeAll = (): RemoveAll => ({
  type: REMOVE_ALL
});

export type AddRecipeToCart = {
  type: typeof ADD_RECIPE_TO_CART,
  payload: DBRecipe
}

export type RemoveRecipeFromCart = {
  type: typeof REMOVE_RECIPE_FROM_CART,
  payload: string
}

export type RemoveItemFromCart = {
  type: typeof REMOVE_ITEM_FROM_CART,
  payload: string,
}

export type RemoveAll = {
  type: typeof REMOVE_ALL
}

export type ActionTypes = AddRecipeToCart | RemoveRecipeFromCart | RemoveItemFromCart | RemoveAll;