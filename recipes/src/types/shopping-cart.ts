import Recipe, { Ingredient } from './recipes';

interface ShoppingItem extends Ingredient {
  _id: string,
}

export default ShoppingItem;