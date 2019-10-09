import ShoppingItem from 'types/shopping-cart';
import { ActionTypes, ADD_RECIPE_TO_CART, REMOVE_RECIPE_FROM_CART, REMOVE_ITEM_FROM_CART, REMOVE_ALL, ADD_ALL } from './actions';
import { createShoppingList, getItemsFromRecipe } from './services';

export type ShoppingCartState = {
  items: ShoppingItem[],
  recipesId: string[],
}

const initialState: ShoppingCartState = {
    items: [],
    recipesId: []
};

const shoppingCartReducer = (
  state = initialState,
  action: ActionTypes
): ShoppingCartState => {
  switch (action.type) {
    case ADD_RECIPE_TO_CART:
      return {
        items: createShoppingList(state.items, getItemsFromRecipe(action.payload)),
        recipesId: state.recipesId.concat([action.payload._id])
      }
    case REMOVE_RECIPE_FROM_CART: 
      return {
        items: state.items.filter(
          item => item.recipeId !== action.payload
        ),
        recipesId: state.recipesId.filter(item => item !== action.payload)
      }
    case REMOVE_ITEM_FROM_CART: 
      return {
        ...state,
        items: state.items.filter(
          item => item.name !== action.payload
        )
      }
    case REMOVE_ALL:
      return {
        items: [],
        recipesId: []
      }
    case ADD_ALL:
      const all = action.payload.reduce((items, x) => {
        return [
          ...items,
          ...getItemsFromRecipe(x)
        ];
      }, [] as ShoppingItem[])
      return {
        ...state,
        items: createShoppingList(state.items, all)
      }
    default:
      return state
  }
}

export default shoppingCartReducer;