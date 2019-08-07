import ShoppingItem from 'types/shopping-cart';
import { ActionTypes, ADD_RECIPE_TO_CART, REMOVE_RECIPE_FROM_CART, REMOVE_ITEM_FROM_CART, REMOVE_ALL } from './actions';
import { DBRecipe, Ingredient } from 'src/types/recipes';
import { update } from 'ramda';
import { Convert, GetMeasure, Measure } from 'services/measurements';

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
        recipeName: ['Chicken', 'Fried Chicken']
      },
      {
        name: 'eggs',
        quantity: 2,
        unit: '',
        _original: '2 Eggs',
        suggestions: [],
        recipeId: '5d37045aef8ef87af296cba7',
        recipeName: ['Chicken']
      },
      {
        name: 'freshly grated parm',
        quantity: 0,
        unit: '',
        _original: 'Freshly Grated Parm',
        suggestions: [],
        recipeId: '5d37045aef8ef87af296cba7',
        recipeName: ['Chicken']
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
        recipeName: ['Chicken']
      },
      {
        name: 'salt and pepper, to taste',
        quantity: 0,
        unit: '',
        _original: 'Salt and Pepper, to taste',
        suggestions: [],
        recipeId: '5d37045aef8ef87af296cba7',
        recipeName: ['Chicken']
      },
      {
        name: 'light olive oil for shallow frying',
        quantity: 0,
        unit: '',
        _original: 'Light Olive Oil for shallow Frying',
        recipeId: '5d37045aef8ef87af296cba7',
        recipeName: ['Chicken']
      },
      {
        name: 'olive oil',
        quantity: 3,
        unit: 'tbsp',
        _original: '3 Tbsp of Olive Oil',
        recipeId: '5d37045aef8ef87af296cba7',
      },
    ],
    recipesId: [
      '5d37045aef8ef87af296cba7'
    ]
};

const getItemsFromRecipe = (recipe: DBRecipe): ShoppingItem[] => {
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
    default:
      return state
  }
}

export default shoppingCartReducer;