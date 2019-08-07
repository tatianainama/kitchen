import Recipe, { Ingredient } from './recipes';

interface ShoppingItem extends Ingredient {
  recipeId: string,
  recipeName?: string[]
}

export default ShoppingItem;