import Recipe, { Ingredient } from './recipes';

interface ShoppingItem extends Ingredient {
  recipeId: string,
}

export default ShoppingItem;