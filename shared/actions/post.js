import * as ActionTypes from '../constants/constants'
import * as Actions from './actions'
import { apiRequest } from '../lib/request'

export function createPostSuccess (data) {
  return Actions.updateEntities(data.entities)
}

export function editPostSuccess (data) {
  return Actions.updateEntities(data.entities)
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

export function fetchPost (id) {
  return (dispatch, state) => {
    return apiRequest(state, `/getPost/${id}`)
      .then(data => dispatch(Actions.updateEntities(data.entities)))
  }
}
