import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { recipesReducer } from './recipes/reducers';

const composeEnhancers = composeWithDevTools({});

const configureStore = () => {
  return createStore(
    recipesReducer,
    undefined,
    composeEnhancers(
      applyMiddleware(thunk)
    )
  )
}

export default configureStore;