import ShoppingItem from 'types/shopping-cart';
import { ActionTypes, ADD_TO_CART, REMOVE_RECIPE_FROM_CART, REMOVE_ITEM_FROM_CART } from './actions';
import { DBRecipe } from 'src/types/recipes';

export type ShoppingCartState = {
  items: ShoppingItem[],
  recipesId: string[],
}

const initialState: ShoppingCartState = {
    items: [
      {
        name: 'chicken breast',
        quantity: 113.4,
        unit: 'g',
        _original: '4 6oz Chicken Breast',
        suggestions: [],
        recipeId: '5d37045aef8ef87af296cba7',
        recipeName: 'Sunday Night Chicken Parm'
      },
      {
        name: 'eggs',
        quantity: 2,
        unit: '',
        _original: '2 Eggs',
        suggestions: [],
        recipeId: '5d37045aef8ef87af296cba7',
        recipeName: 'Sunday Night Chicken Parm'
      },
      {
        name: 'freshly grated parm',
        quantity: 0,
        unit: '',
        _original: 'Freshly Grated Parm',
        suggestions: [],
        recipeId: '5d37045aef8ef87af296cba7',
        recipeName: 'Sunday Night Chicken Parm'
      },
      {
        name: 'bread crumbs',
        quantity: 1.5,
        unit: 'cup',
        _original: '1-1/2 cups of Bread Crumbs',
        suggestions: [
          {
            _id: '5d358c0be26a103030879377',
            name: 'bread flour',
            variants: [
              'bread flour'
            ],
            equivalence: 127,
            referenceUnit: 'cup',
            prefferedUnit: 'g',
            translation: {
              dutch: 'tarwebloem'
            },
            measure: 2
          }
        ],
        recipeId: '5d37045aef8ef87af296cba7',
        recipeName: 'Sunday Night Chicken Parm'
      },
      {
        name: 'salt and pepper, to taste',
        quantity: 0,
        unit: '',
        _original: 'Salt and Pepper, to taste',
        suggestions: [],
        recipeId: '5d37045aef8ef87af296cba7',
        recipeName: 'Sunday Night Chicken Parm'
      },
      {
        name: 'light olive oil for shallow frying',
        quantity: 0,
        unit: '',
        _original: 'Light Olive Oil for shallow Frying',
        recipeId: '5d37045aef8ef87af296cba7',
        recipeName: 'Sunday Night Chicken Parm'
      },
      {
        name: 'olive oil',
        quantity: 3,
        unit: 'tbsp',
        _original: '3 Tbsp of Olive Oil',
        recipeId: '5d37045aef8ef87af296cba7',
        recipeName: 'Sunday Night Chicken Parm'
      },
    ],
    recipesId: [
      '5d37045aef8ef87af296cba7'
    ]
};

const getIngredients = (recipe: DBRecipe): ShoppingItem[] => {
  return recipe.ingredients.reduce((ingredients, subRecipe) => {
    return [
      ...ingredients,
      ...subRecipe.ingredients.map(ingredient => ({
        ...ingredient,
        recipeId: recipe._id,
        recipeName: recipe.name
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
    case REMOVE_RECIPE_FROM_CART: 
      return {
        items: state.items.filter(
          item => item.recipeId !== action.payload
        ),
        recipesId: state.recipesId.filter(item => item !== action.payload)
      }
    case REMOVE_ITEM_FROM_CART: 
      console.log("remove item", action)
      return {
        ...state,
        items: state.items.filter(
          item => item.name !== action.payload
        )
      }
    default:
      return state
  }
}

export default shoppingCartReducer;