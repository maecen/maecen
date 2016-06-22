import Immutable from 'seamless-immutable'
import * as ActionTypes from '../constants/constants'

export const user = (state = Immutable({
  ids: [],
  authUser: null,
  authToken: null
}), action) => {
  switch (action.type) {
    case ActionTypes.SET_AUTH_USER:
      return state.merge({
        authUser: action.id,
        authToken: action.token
      })
    case ActionTypes.CLEAR_AUTH_USER:
      return state.merge({
        authToken: null,
        authUser: null
      })
    case ActionTypes.SET_USER_LIST:
      return state.set('ids', action.ids)
    default:
      return state
  }
}

export const app = (state = Immutable({
  maecenate: null,
  maecenates: [],
  posts: [],
  requireAuthorization: false
}), action) => {
  switch (action.type) {
    case ActionTypes.SET_AUTH_USER:
      return state.merge({
        requireAuthorization: false
      })

    case ActionTypes.REQUIRE_AUTHORIZATION:
      const val = action.url ? action.url : true
      return state.set('requireAuthorization', val)

    case ActionTypes.CANCEL_REQUIRE_AUTHORIZATION:
      return state.set('requireAuthorization', false)

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
  supports: {},
  posts: {},
  media: {},
  maecenates: {}
}), action) => {
  if (action.entities) {
    return state.merge(action.entities, {deep: true})
  }

  return state
}

