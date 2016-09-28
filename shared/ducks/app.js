import Immutable from 'seamless-immutable'
import { actionTypes as usersActionTypes } from './users'

// Actions
export const actionTypes = {
  REQUIRE_AUTHORIZATION: 'maecen/app/REQUIRE_AUTHORIZATION',
  CANCEL_REQUIRE_AUTHORIZATION: 'maecen/app/CANCEL_REQUIRE_AUTHORIZATION',
  FETCH_MAECENATE_FAILURE: 'maecen/app/FETCH_MAECENATE_FAILURE'
}

// Reducer
const reducer = (state = Immutable({
  pageStatus: 200,
  requireAuthorization: false
}), action) => {
  switch (action.type) {
    case usersActionTypes.SET_AUTH:
      return state.set('requireAuthorization', false)

    case actionTypes.REQUIRE_AUTHORIZATION:
      const val = action.url ? action.url : true
      return state.set('requireAuthorization', val)

    case actionTypes.CANCEL_REQUIRE_AUTHORIZATION:
      return state.set('requireAuthorization', false)

    // case actionTypes.SET_MAECENATE_LIST:
    //   return state.set('maecenates', action.ids)

    case actionTypes.FETCH_MAECENATE_FAILURE:
      return state.set('pageStatus', 404)

    default:
      return state
  }
}

export default reducer
