import ShoppingItem, { ShoppingRecipe, DBShoppingCart } from 'types/shopping-cart';
import { Ingredient } from 'types/recipes';
import { Convert, GetMeasure, Measure } from 'services/measurements';
import { update, uniq } from 'ramda';
import axios from 'axios';

const SHOPPING: string = process.env.REACT_APP_API_SHOPPING || '';

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
    if (a.quantity && b.quantity && (a.unit === 'unit' || b.unit === 'unit')) {
      return {
        ...a,
        quantity: a.quantity + b.quantity
      }
    }
    if (a.unit !== b.unit) {
      throw Error(`cannot sum this units: ${b.unit}, ${a.unit}`)
    } else {
      return {
        ...a,
        quantity: a.quantity + b.quantity
      }
    }
  }
}

const combineMultipleItems = (items: ShoppingItem[]): ShoppingItem => {
  return items.reduce((combined, item) => ({
    ...combineItems(combined, item),
    recipeName: uniq([
      ...combined.recipeName || [],
      ...item.recipeName || []
    ]),
  }))
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

const fetchShoppingCart = async (): Promise<DBShoppingCart> => {
  const response = await axios.get(`${SHOPPING}/`);
  return response.data;
}

const saveShoppingCart = async (cart: ShoppingItem[]): Promise<DBShoppingCart> => {
  return axios.post(`${SHOPPING}/`, { items: cart }).then(
    response => response.data
  ).catch(error => error);
}

export {
  getItemsFromRecipe,
  combineItems,
  createShoppingList,
  createShoppingItem,
  fetchShoppingCart,
  saveShoppingCart,
  combineMultipleItems
}