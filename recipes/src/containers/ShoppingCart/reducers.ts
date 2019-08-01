import ShoppingItem from 'types/shopping-cart';
import { ActionTypes, ADD_TO_CART, REMOVE_FROM_CART } from './actions';
import { DBRecipe } from 'src/types/recipes';

type ShoppingCartState = {
  items: ShoppingItem[],
  recipesId: string[],
}

const initialState: ShoppingCartState = {
  items: [],
  recipesId: []
};

const getIngredients = (recipe: DBRecipe): ShoppingItem[] => {
  return recipe.ingredients.reduce((ingredients, subRecipe) => {
    return [
      ...ingredients,
      ...subRecipe.ingredients.map(ingredient => ({
        ...ingredient,
        recipeId: recipe._id
      })),
    ]
  }, [] as ShoppingItem[])
} 

const shoppingCartReducer = (
  state = initialState,
  action: ActionTypes
): ShoppingCartState => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        items: [
          ...state.items,
          ...getIngredients(action.payload)
        ],
        recipesId: state.recipesId.concat([action.payload._id])
      }
    case REMOVE_FROM_CART: 
      return {
        items: state.items.filter(
          item => item.recipeId !== action.payload
        ),
        recipesId: state.recipesId.filter(item => item !== action.payload)
      }
    default:
      return state
  }
}

export default shoppingCartReducer;