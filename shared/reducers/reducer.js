import Immutable from 'seamless-immutable'
import * as ActionTypes from '../constants/constants'

export const user = (state = Immutable({
}), action) => {
  switch (action.type) {
    default:
      return state
  }
}

export const app = (state = Immutable({
  authUser: null,
  maecenate: null,
  maecenates: [],
  posts: [],
  requireAuthorization: false
}), action) => {
  switch (action.type) {
    case ActionTypes.SET_AUTH_USER:
      return state.merge({
        'authUser': action.id,
        'requireAuthorization': false
      })

    case ActionTypes.REQUIRE_AUTHORIZATION:
      const val = action.url ? action.url : true
      return state.set('requireAuthorization', val)

    case ActionTypes.CANCEL_REQUIRE_AUTHORIZATION:
      return state.set('requireAuthorization', false)

    case ActionTypes.CLEAR_AUTH_USER:
      return state.set('authUser', null)

    case ActionTypes.SET_MAECENATE:
      return state.set('maecenate', action.id)

    case ActionTypes.SET_MAECENATE_LIST:
      return state.set('maecenates', action.ids)

    case ActionTypes.SET_POSTS:
      return state.set('posts', action.ids)

    default:
      return state
  }
}

export const entities = (state = Immutable({
  users: {},
  userSupports: {},
  posts: {},
  media: {},
  maecenates: {}
}), action) => {
  if (action.entities) {
    return state.merge(action.entities, {deep: true})
  }

  return state
}

