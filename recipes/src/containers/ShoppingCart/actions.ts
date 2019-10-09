import { DBRecipe, SubRecipe } from 'types/recipes';
import { ShoppingRecipe } from 'types/shopping-cart';
import { bindActionCreators } from 'redux';

export const ADD_RECIPE_TO_CART = 'ADD_ RECIPE_TO_CART';
export const REMOVE_RECIPE_FROM_CART = 'REMOVE_RECIPE_FROM_CART';
export const REMOVE_ITEM_FROM_CART = 'REMOVE_ITEM_FROM_CART';
export const REMOVE_ALL = 'REMOVE_ALL';
export const ADD_ALL = 'ADD_ALL';

export const addRecipeToCart = (recipe: ShoppingRecipe): AddRecipeToCart => ({
  type: ADD_RECIPE_TO_CART,
  payload: recipe
})

export const removeFromCart = (recipe: ShoppingRecipe): RemoveRecipeFromCart => ({
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

export const addAll = (recipes: ShoppingRecipe[]) => ({
  type: ADD_ALL,
  payload: recipes
})

export type AddRecipeToCart = {
  type: typeof ADD_RECIPE_TO_CART,
  payload: ShoppingRecipe
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

export type AddAll = {
  type: typeof ADD_ALL,
  payload: ShoppingRecipe[]
}

export type ActionTypes = AddRecipeToCart | RemoveRecipeFromCart | RemoveItemFromCart | RemoveAll | AddAll;

export default {
  addRecipeToCart,
  removeFromCart,
  removeItemFromCart,
  removeAll,
  addAll
}