const initialState = {
  recipes: {
    isFetching: false,
    data: [],
    selectedRecipe: undefined,
  }
};

export const recipesReducer = (
  state = initialState,
  action: any
) => {
  switch (action.type) {
    case 'REQUEST_RECIPES': 
      return {
        ...state,
        recipes: {
          ...state.recipes,
          isFetching: action.isFetching,
        }
      }
    case 'RECEIVE_RECIPES':
      return {
        ...state,
        recipes: {
          ...state.recipes,
          isFetching: action.isFetching,
          data: action.payload || state.recipes.data,
        }
      }
    case 'SELECT_RECIPE':
      return {
        ...state,
        recipes: {
          ...state.recipes,
          selectedRecipe: action.payload
        }
      }
    default:
      return state;
  }
}