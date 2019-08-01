import { DBRecipe } from 'types/recipes';
import ShoppingItem from 'types/shopping-cart';

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

const getIngredients = (recipe: DBRecipe): ShoppingItem[] => {
  return recipe.ingredients.reduce((ingredients, subRecipe) => {
    return [
      ...ingredients,
      ...subRecipe.ingredients.map(ingredient => ({
        ...ingredient,
        recipeId: recipe._id
      })),
    ]
  }, [] as ShoppingItem[])
} 

export const addToCart = (recipe: DBRecipe): AddToCart => ({
  type: ADD_TO_CART,
  payload: getIngredients(recipe)
})

export const removeFromCart = (recipe: DBRecipe): RemoveFromCart => ({
  type: REMOVE_FROM_CART,
  payload: recipe._id
})

export type AddToCart = {
  type: typeof ADD_TO_CART,
  payload: ShoppingItem[]
}

export type RemoveFromCart = {
  type: typeof REMOVE_FROM_CART,
  payload: string
}

export type ActionTypes = AddToCart | RemoveFromCart