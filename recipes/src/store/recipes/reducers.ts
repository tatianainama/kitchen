const initialState = {
  recipes: {
    isFetching: false,
    data: [],
  }
};

export const recipesReducer = (
  state = initialState,
  action: any
) => {
  console.log("action", action)
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
    default:
      return state;
  }
}