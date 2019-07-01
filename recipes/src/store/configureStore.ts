import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { recipesReducer } from 'containers/Recipes/List/reducers';
import { createReducer } from 'containers/Recipes/Create/reducers';

const composeEnhancers = composeWithDevTools({});
const rootReducer = combineReducers({
  recipes: combineReducers({
    list: recipesReducer,
    create: createReducer
  })
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