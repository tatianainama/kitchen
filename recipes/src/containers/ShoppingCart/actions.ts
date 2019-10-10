import { ThunkAction } from 'redux-thunk';
import { DBRecipe, SubRecipe } from 'types/recipes';
import { ShoppingRecipe, DBShoppingCart, ShoppingItem } from 'types/shopping-cart';
import { bindActionCreators, Action, ActionCreator, Dispatch } from 'redux';
import { fetchShoppingCart, saveShoppingCart } from './services';

export const ADD_RECIPE_TO_CART = 'ADD_ RECIPE_TO_CART';
export const REMOVE_RECIPE_FROM_CART = 'REMOVE_RECIPE_FROM_CART';
export const REMOVE_ITEM_FROM_CART = 'REMOVE_ITEM_FROM_CART';
export const REMOVE_ALL = 'REMOVE_ALL';
export const ADD_ALL = 'ADD_ALL';

export const REQUEST_CART = 'REQUEST_CART';
export const RECEIVE_CART = 'RECEIVE_CART';

export const PENDING_SAVE_CART = 'PENDING_SAVE_CART';
export const CONFIRM_SAVE_CART = 'CONFIRM_SAVE_CART';
export const REJECT_SAVE_CART = 'REJECT_SAVE_CART';

export const DELETE_CART = 'DELETE_CART';

export const addRecipeToCart = (recipe: ShoppingRecipe): AddRecipeToCart => ({
  type: ADD_RECIPE_TO_CART,
  payload: recipe
})

export const removeFromCart = (recipe: ShoppingRecipe): RemoveRecipeFromCart => ({
  type: REMOVE_RECIPE_FROM_CART,
  payload: recipe._id
})

export const removeItemFromCart = (id: string): RemoveItemFromCart => ({
  type: REMOVE_ITEM_FROM_CART,
  payload: id
})

export const removeAll = (): RemoveAll => ({
  type: REMOVE_ALL
});

export const addAll = (recipes: ShoppingRecipe[]) => ({
  type: ADD_ALL,
  payload: recipes
})

export const requestCart = (): RequestCartAction => ({
  type: REQUEST_CART
})

export const receiveCart = (cart: DBShoppingCart): ReceiveCartAction => ({
  type: RECEIVE_CART,
  payload: cart,
})

export const fetchCartActionCreator: ActionCreator<
  ThunkAction<
    Promise<ReceiveCartAction>,
    DBShoppingCart,
    any,
    ReceiveCartAction
  >
> = () => {
  return async (dispatch: Dispatch) => {
    dispatch(requestCart());
    const shoppingCart = await fetchShoppingCart();
    return dispatch(receiveCart(shoppingCart));
  } 
}

export const pendingSaveCart = (cart: ShoppingItem[]): PendingSaveCartAction => ({
  type: PENDING_SAVE_CART,
  cart,
});

export const confirmSaveCart = (cart: DBShoppingCart): ConfirmSaveCartAction => ({
  type: CONFIRM_SAVE_CART,
  cart,
});

export const rejectSaveCart = (error: Error): RejectSaveCartAction => ({
  type: REJECT_SAVE_CART,
  error: error.message
});

export const saveCartActionCreator: ActionCreator<
  ThunkAction<
    Promise<ConfirmSaveCartAction|RejectSaveCartAction>,
    DBShoppingCart,
    any,
    ConfirmSaveCartAction|RejectSaveCartAction
  >
> = (cart: ShoppingItem[]) => {
  return async (dispatch: Dispatch) => {
    dispatch(pendingSaveCart(cart));
    try {
      const result = await saveShoppingCart(cart);
      return dispatch(confirmSaveCart(result));
    } catch (error) {
      return dispatch(rejectSaveCart(error))
    }
  }
}

export const deleteCart = (): DeleteCartAction => ({
  type: DELETE_CART
})

export type AddRecipeToCart = {
  type: typeof ADD_RECIPE_TO_CART,
  payload: ShoppingRecipe
}

export type RemoveRecipeFromCart = {
  type: typeof REMOVE_RECIPE_FROM_CART,
  payload: string
}

export type RemoveItemFromCart = {
  type: typeof REMOVE_ITEM_FROM_CART,
  payload: string,
}

export type RemoveAll = {
  type: typeof REMOVE_ALL
}

export type AddAll = {
  type: typeof ADD_ALL,
  payload: ShoppingRecipe[]
}

export interface RequestCartAction extends Action<'REQUEST_CART'> {};
export interface ReceiveCartAction extends Action<'RECEIVE_CART'> { payload: DBShoppingCart };
export interface PendingSaveCartAction extends Action<'PENDING_SAVE_CART'> { cart: ShoppingItem[] };
export interface ConfirmSaveCartAction extends Action<'CONFIRM_SAVE_CART'> { cart: DBShoppingCart };
export interface RejectSaveCartAction extends Action<'REJECT_SAVE_CART'> { error: string };
export interface DeleteCartAction extends Action<'DELETE_CART'> {};

export type ActionTypes = 
  AddRecipeToCart | 
  RemoveRecipeFromCart | 
  RemoveItemFromCart | 
  RemoveAll | 
  AddAll |
  RequestCartAction |
  ReceiveCartAction |
  PendingSaveCartAction |
  PendingSaveCartAction |
  ConfirmSaveCartAction |
  RejectSaveCartAction |
  DeleteCartAction;

export default {
  addRecipeToCart,
  removeFromCart,
  removeItemFromCart,
  removeAll,
  addAll,
  deleteCart
}