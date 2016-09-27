import { actionTypes } from '../ducks/posts'
import * as Actions from './actions'
import { apiRequest } from '../lib/request'

// Private Actions
// ===============
function setPosts (ids, entities) {
  return {
    type: actionTypes.SET,
    ids,
    entities
  }
}

function fetchMaecenatePostsSuccess (data) {
  const ids = data.result
  return setPosts(ids, data.entities)
}

// Fetch User Feed
// ---------------
function fetchUserFeedRequest () {
  return {
    type: actionTypes.FETCH_FEED_REQUEST
  }
}

function fetchUserFeedSuccess (ids, entities) {
  return {
    type: actionTypes.FETCH_FEED_SUCCESS,
    ids,
    entities
  }
}

function fetchUserFeedFailure (err, status) {
  return {
    type: actionTypes.FETCH_FEED_FAILURE,
    err,
    status
  }
}

// Public Actions
// ==============
export function createPostSuccess (data) {
  return Actions.updateEntities(data.entities)
}

export function editPostSuccess (data) {
  return Actions.updateEntities(data.entities)
}

export function fetchPost (id) {
  return (dispatch, state) => {
    return apiRequest(state, `/posts/${id}`)
      .then(data => dispatch(Actions.updateEntities(data.entities)))
  }
}

export function fetchMaecenatePosts (slug) {
  return (dispatch, state) => {
    dispatch(setPosts([], null))
    return apiRequest(state, `/maecenates/${slug}/feed`)
      .then(data => dispatch(fetchMaecenatePostsSuccess(data)))
  }
}

// User Feed
// ---------
export function fetchUserFeed () {
  return (dispatch, state) => {
    dispatch(fetchUserFeedRequest())
    return apiRequest(state, '/users/me/feed')
    .then(data =>
      dispatch(fetchUserFeedSuccess(data.result, data.entities))
    )
    .catch(err =>
      dispatch(fetchUserFeedFailure(err, err.status))
    )
  }
}
