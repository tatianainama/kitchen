import Recipe, { Ingredient, SubRecipe } from './recipes';

export interface ShoppingItem extends Ingredient {
  recipeId?: string,
  recipeName?: string[]
}

export interface ShoppingRecipe {
  _id: string,
  name: string,
  ingredients: SubRecipe[]
}

export interface DBShoppingCart {
  _id: string,
  date: Date,
  items: ShoppingItem[]
}

export type ShoppingCartState = {
  items: ShoppingItem[],
  recipesId: string[],
  isFetching: boolean,
  error?: string,
}

export default ShoppingItem;