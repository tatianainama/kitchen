const initialState = {
  isFetching: false,
  data: [],
  selectedRecipe: undefined,
  shoppingCart: []
};

export const recipesReducer = (
  state = initialState,
  action: any
) => {
  switch (action.type) {
    case 'REQUEST_RECIPES': 
      return {
        ...state,
        isFetching: action.isFetching,
      }
    case 'RECEIVE_RECIPES':
      return {
        ...state,
        isFetching: action.isFetching,
        data: action.payload || state.data,
      }
    case 'SELECT_RECIPE':
      return {
        ...state,
        selectedRecipe: action.payload
      }
    default:
      return state;
  }
}