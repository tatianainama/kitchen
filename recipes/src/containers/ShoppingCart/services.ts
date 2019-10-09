import ShoppingItem, { ShoppingRecipe } from 'types/shopping-cart';
import { Ingredient } from 'types/recipes';
import { Convert, GetMeasure, Measure } from 'services/measurements';
import { update } from 'ramda';

const getItemsFromRecipe = (recipe: ShoppingRecipe): ShoppingItem[] => {
  return recipe.ingredients.reduce((ingredients, subRecipe) => {
    return [
      ...ingredients,
      ...subRecipe.ingredients.map(createShoppingItem(recipe._id, recipe.name)),
    ]
  }, [] as ShoppingItem[])
} 

const combineItems = (a: ShoppingItem, b: ShoppingItem): ShoppingItem => {
  if (a.unit && b.unit) {
    const m = GetMeasure(b.unit);
    return {
      ...a,
      quantity: a.quantity + Convert(b.quantity, b.unit, a.unit, m.name as Measure)
    }
  } else {
    if (a.unit !== b.unit) {
      throw Error(`cannot sum this units: ${b.unit, a.unit}`)
    } else {
      return {
        ...a,
        quantity: a.quantity + b.quantity
      }
    }
  }
}

const createShoppingList = (initial: ShoppingItem[], newItems: ShoppingItem[]): ShoppingItem[] => {
  return newItems.reduce((shoppingCart, newItem) => {
    const existentItemIdx = shoppingCart.findIndex(item => item.name === newItem.name);
    if ( existentItemIdx > -1 ) {
      try {
        const sum = combineItems(initial[existentItemIdx], newItem).quantity
        return update(existentItemIdx, {
          ...initial[existentItemIdx],
          recipeName: (initial[existentItemIdx].recipeName||[]).concat(newItem.recipeName||[]),
          quantity: sum
        }, shoppingCart)
      } catch {
        return [
          ...shoppingCart,
          newItem
        ]
      }
    } else {
      return [
        ...shoppingCart,
        newItem
      ]
    }
  }, initial);
}

const createShoppingItem = (recipeId: string, recipeName: string) => (ingredient: Ingredient): ShoppingItem => {
  return {
    ...ingredient,
    recipeId,
    recipeName: [recipeName]
  };
}

export {
  getItemsFromRecipe,
  combineItems,
  createShoppingList,
  createShoppingItem
}