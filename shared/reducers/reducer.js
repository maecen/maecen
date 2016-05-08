import { combineReducers } from 'redux'
import Immutable from 'seamless-immutable'
import * as ActionTypes from '../constants/constants'

const app = (state = Immutable({
  authUser: null,
  maecenate: null,
  maecenates: []
}), action) => {
  switch (action.type) {
    case ActionTypes.SET_AUTH_USER:
      return state.set('authUser', action.id)
    case ActionTypes.SET_MAECENATE:
      return state.set('maecenate', action.id)
    case ActionTypes.SET_MAECENATE_LIST:
      return state.set('maecenates', action.ids)
    default:
      return state
  }
}

const entities = (state = Immutable({
  users: {}
}), action) => {
  if (action.entities) {
    return state.merge(action.entities, {deep: true})
  }

  return state
}

/*

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_POST :
      return {
        posts: [{
          name: action.name,
          title: action.title,
          content: action.content,
          slug: action.slug,
          cuid: action.cuid,
          _id: action._id,
        }, ...state.posts],
        post: state.post };

    case ActionTypes.CHANGE_SELECTED_POST :
      return {
        posts: state.posts,
        post: action.slug,
      };

    case ActionTypes.ADD_POSTS :
      return {
        posts: action.posts,
        post: state.post,
      };

    case ActionTypes.ADD_SELECTED_POST :
      return {
        post: action.post,
        posts: state.posts,
      };

    case ActionTypes.DELETE_POST :
      return {
        posts: state.posts.filter((post) => post._id !== action.post._id),
      };

    default:
      return state;
  }
};

*/

export default combineReducers({
  app,
  entities
})
