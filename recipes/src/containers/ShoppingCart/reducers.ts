import ShoppingItem from 'types/shopping-cart';
import { ActionTypes, ADD_TO_CART, REMOVE_FROM_CART } from './actions';

type ShoppingCartState = {
  cart: ShoppingItem[]
}

const initialState: ShoppingCartState = {
  cart: []
};

const shoppingCartReducer = (
  state = initialState,
  action: ActionTypes
): ShoppingCartState => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        cart: [
          ...state.cart,
          ...action.payload
        ]
      }
    case REMOVE_FROM_CART: 
      return {
        cart: state.cart.filter(
          item => item._id !== action.payload
        )
      }
    default:
      return state
  }
}

export default shoppingCartReducer;