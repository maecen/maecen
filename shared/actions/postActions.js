import * as ActionTypes from '../constants/constants'
import * as Actions from './actions'
import { apiRequest } from '../lib/request'

// Private Actions
// ===============
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

// Fetch User Feed
// ---------------
function fetchUserFeedRequest () {
  return {
    type: ActionTypes.FETCH_USER_FEED_REQUEST
  }
}

function fetchUserFeedSuccess (ids, entities) {
  return {
    type: ActionTypes.FETCH_USER_FEED_SUCCESS,
    ids,
    entities
  }
}

function fetchUserFeedFailure (err, status) {
  return {
    type: ActionTypes.FETCH_USER_FEED_FAILURE,
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
    return apiRequest(state, `/getPost/${id}`)
      .then(data => dispatch(Actions.updateEntities(data.entities)))
  }
}

export function fetchMaecenatePosts (slug) {
  return (dispatch, state) => {
    dispatch(setPosts([], null))
    return apiRequest(state, `/getMaecenatePosts/${slug}`)
      .then(data => dispatch(fetchMaecenatePostsSuccess(data)))
  }
}

// User Feed
// ---------
export function fetchUserFeed () {
  return (dispatch, state) => {
    dispatch(fetchUserFeedRequest())
    return apiRequest(state, '/getUserFeed')
    .then(data =>
      dispatch(fetchUserFeedSuccess(data.result, data.entities))
    )
    .catch(err =>
      dispatch(fetchUserFeedFailure(err, err.status))
    )
  }
}
