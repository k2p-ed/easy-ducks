import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from './ducks'

const createStoreWithThunk = applyMiddleware(thunk)(createStore)

const store = createStoreWithThunk(
  rootReducer,
  window.devToolsExtension && window.devToolsExtension()
)

export default store
