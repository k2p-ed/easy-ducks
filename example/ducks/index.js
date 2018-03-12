import { combineReducers } from 'redux'

import breeds from './breeds'
import subBreeds from './subBreeds'

export default combineReducers({
  breeds,
  subBreeds
})
