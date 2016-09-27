import Immutable from 'seamless-immutable'

// Actions
export const actionTypes = {
  SET_AUTH: 'maecen/users/SET_AUTH',
  CLEAR_AUTH: 'maecen/users/CLEAR_AUTH',
  SET_USER_LIST: 'maecen/users/SET_USER_LIST'
}

// Reducer
export const reducer = (state = Immutable({
  ids: [],
  authUser: null,
  authToken: null
}), action) => {
  switch (action.type) {
    case actionTypes.SET_AUTH:
      return state.merge({
        authUser: action.id,
        authToken: action.token
      })
    case actionTypes.CLEAR_AUTH:
      return state.merge({
        authToken: null,
        authUser: null
      })
    case actionTypes.SET_USER_LIST:
      return state.set('ids', action.ids)
    default:
      return state
  }
}

export default reducer
