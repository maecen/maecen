import Immutable from 'seamless-immutable'

// Actions
export const actionTypes = {
  FETCH_FEED_REQUEST: 'maecen/posts/FETCH_FEED_REQUEST',
  FETCH_FEED_SUCCESS: 'maecen/posts/FETCH_FEED_SUCCESS',
  FETCH_FEED_FAILURE: 'maecen/posts/FETCH_FEED_FAILURE',
  SET: 'maecen/posts/SET'
}

// Reducer
export const posts = (state = Immutable({
  ids: [],
  isFetching: false
}), action) => {
  switch (action.type) {
    case actionTypes.FETCH_FEED_REQUEST:
      return state.set('isFetching', true)

    case actionTypes.SET:
    case actionTypes.FETCH_FEED_SUCCESS:
      return state.merge({
        ids: action.ids,
        isFetching: false
      })

    case actionTypes.FETCH_FEED_FAILURE:
      return state.set('isFetching', false)

    default:
      return state
  }
}

export default posts
