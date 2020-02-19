const initialState = {
  isFetching: false,
  data: [],
  selectedRecipe: undefined,
  shoppingCart: [],
  id: '',
  result: undefined
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
    case 'DELETE_RECIPE':
      return {
        ...state,
        id: action.id,
        isFetching: true
      }
    case 'CONFIRM_DELETE_RECIPE':
      return {
        ...state,
        isFetching: false,
        id: '',
        result: action.result
      }
    case 'REJECT_DELETE_RECIPE':
      return {
        ...state,
        isFetching: false,
        id: '',
        result: action.result
      }
    default:
      return state;
  }
}