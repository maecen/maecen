import * as ActionTypes from '../constants/constants'
import * as Actions from './actions'
import { apiRequest } from '../lib/request'

export function createMaecenatePostSuccess (data) {
  return (dispatch) => {
    dispatch(Actions.updateEntities(data.entities))
  }
}

function setPosts (ids, entities) {
  return {
    type: ActionTypes.SET_POSTS,
    ids,
    entities
  }
}

function fetchMaecenatePostsSuccess (data) {
  const ids = data.result
  return setPosts(ids, data.entities)
}

export function fetchMaecenatePosts (slug) {
  return (dispatch, state) => {
    dispatch(setPosts([], null))
    return apiRequest(state, `/getMaecenatePosts/${slug}`)
      .then(data => dispatch(fetchMaecenatePostsSuccess(data)))
  }
}
