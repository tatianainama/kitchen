
import ShoppingItem, { ShoppingCartState } from 'types/shopping-cart';
import { ActionTypes,
  ADD_RECIPE_TO_CART,
  REMOVE_RECIPE_FROM_CART,
  REMOVE_ITEM_FROM_CART,
  REMOVE_ALL,
  ADD_ALL,
  PENDING_SAVE_CART,
  CONFIRM_SAVE_CART,
  REJECT_SAVE_CART,
  DELETE_CART,
  REQUEST_CART,
  RECEIVE_CART
} from './actions';
import { createShoppingList, getItemsFromRecipe } from './services';

const initialState: ShoppingCartState = {
    items: [],
    recipesId: [],
    isFetching: false,
};

const shoppingCartReducer = (
  state = initialState,
  action: ActionTypes
): ShoppingCartState => {
  switch (action.type) {
    case ADD_RECIPE_TO_CART:
      return {
        ...state,
        items: createShoppingList(state.items, getItemsFromRecipe(action.payload)),
        recipesId: state.recipesId.concat([action.payload._id])
      }
    case REMOVE_RECIPE_FROM_CART: 
      return {
        ...state,
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
        ...state,
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
    case PENDING_SAVE_CART:
      return {
        ...state
      };
    case CONFIRM_SAVE_CART:
      return {
        ...state
      };
    case REJECT_SAVE_CART:
      return {
        ...state
      };
    case DELETE_CART:
      return {
        ...state
      };
    case REQUEST_CART:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_CART:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}

export default shoppingCartReducer;