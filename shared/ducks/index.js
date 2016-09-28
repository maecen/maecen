// Imports
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

// Reducers
import app from './app'
import entities from './entities'
import posts from './posts'
import users from './users'
import maecenates from './maecenates'

const reducer = combineReducers({
  app,
  entities,
  posts,
  users,
  maecenates,
  routing: routerReducer
})

export default reducer
