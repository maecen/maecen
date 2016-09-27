// Imports
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

// Reducers
import app from './app'
import entities from './entities'
import posts from './posts'
import users from './users'

const reducer = combineReducers({
  app,
  entities,
  posts,
  users,
  routing: routerReducer
})

export default reducer
