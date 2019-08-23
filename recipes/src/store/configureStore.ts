import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { recipesReducer } from 'containers/Recipes/List/reducers';
import shoppingCartReducer from 'containers/ShoppingCart/reducers';
import plannerReducer from 'containers/Planner/reducers';

const composeEnhancers = composeWithDevTools({});
const rootReducer = combineReducers({
  recipes: recipesReducer,
  shoppingCart: shoppingCartReducer,
  planner: plannerReducer
})

const configureStore = () => {
  return createStore(
    rootReducer,
    undefined,
    composeEnhancers(
      applyMiddleware(thunk)
    )
  )
}

export type AppState = ReturnType<typeof rootReducer>
export default configureStore;