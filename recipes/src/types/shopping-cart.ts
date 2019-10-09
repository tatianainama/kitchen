import Recipe, { Ingredient, SubRecipe } from './recipes';

interface ShoppingItem extends Ingredient {
  recipeId?: string,
  recipeName?: string[]
}

export interface ShoppingRecipe {
  _id: string,
  name: string,
  ingredients: SubRecipe[]
}

export default ShoppingItem;