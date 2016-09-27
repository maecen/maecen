import Immutable from 'seamless-immutable'

// Actions
export const actionTypes = {
  UPDATE: 'maecen/entities/UPDATE'
}

// Reducer
const entities = (state = Immutable({
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

export default entities
