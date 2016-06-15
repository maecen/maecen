import { browserHistory } from 'react-router'
import * as ActionTypes from '../constants/constants'
import request from '../lib/request'
import { getAuthToken } from '../selectors/User.selectors'
import { apiURL } from '../config'

export function setAuthUser (id, token, entities) {
  return {
    type: ActionTypes.SET_AUTH_USER,
    id,
    token,
    entities
  }
}

export function authUser (credentials) {
  return (dispatch) => { }
}

function clearAuthUser () {
  return {
    type: ActionTypes.CLEAR_AUTH_USER
  }
}

export function clearAuth () {
  return (dispatch, state) => {
    const token = getAuthToken(state())
    request(`${apiURL}/clearAuth`, { method: 'POST', token })
      .then(res => res.data)
      .then(data => {
        dispatch(clearAuthUser())
        browserHistory.push('/')
      })
  }
}

export function requireAuth (url) {
  url = url || null

  return {
    type: ActionTypes.REQUIRE_AUTHORIZATION,
    url
  }
}

export function cancelRequireAuth () {
  return {
    type: ActionTypes.CANCEL_REQUIRE_AUTHORIZATION
  }
}

export function updateEntities (entities) {
  return {
    type: ActionTypes.UPDATE_ENTITIES,
    entities
  }
}

export function createMaecenateSuccess (data) {
  return (dispatch) => {
    dispatch(updateEntities(data.entities))
  }
}

function fetchMaecenateSuccess (data) {
  const id = data.result[0]

  return {
    type: ActionTypes.SET_MAECENATE,
    id,
    entities: data.entities
  }
}

export function fetchMaecenate (slug) {
  return (dispatch, state) => {
    const token = getAuthToken(state())
    return request(`${apiURL}/getMaecenate/${slug}`, { token })
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenateSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}

function fetchUserListSuccess (data) {
  const ids = data.result

  return {
    type: ActionTypes.SET_USER_LIST,
    ids,
    entities: data.entities
  }
}

function fetchMaecenateListSuccess (data) {
  const ids = data.result

  return {
    type: ActionTypes.SET_MAECENATE_LIST,
    ids,
    entities: data.entities
  }
}

export function fetchMaecenateList () {
  return (dispatch, state) => {
    const token = getAuthToken(state())
    return request(`${apiURL}/getMaecenates`, { token })
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenateListSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}

export function fetchAdminMaecenateList (userId) {
  return (dispatch, state) => {
    const token = getAuthToken(state())
    return request(`${apiURL}/getUserMaecenates/${userId}`, { token })
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenateListSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}

export function fetchSupportedMaecenateList (userId) {
  return (dispatch, state) => {
    const token = getAuthToken(state())
    return request(`${apiURL}/getSupportedMaecenates/${userId}`, { token })
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenateListSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}

export function fetchMaecenateSupporterList (slug) {
  return (dispatch, state) => {
    const token = getAuthToken(state())
    return request(`${apiURL}/getMaecenateSupporters/${slug}`, { token })
      .then(res => res.data)
      .then(data => dispatch(fetchUserListSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}

export function changeLanguage (lang) {
  return (dispatch, state) => {
    const token = getAuthToken(state())
    return request(`${apiURL}/setUserLanguage`, {
      method: 'PUT',
      data: { lng: lang },
      token
    }).then(res => res.data)
      .then(res => {
        if (res.success === true) {
          window.location.reload()
        }
      })
  }
}

export function createMaecenatePostSuccess (data) {
  return (dispatch) => {
    dispatch(updateEntities(data.entities))
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
    const token = getAuthToken(state())
    return request(`${apiURL}/getMaecenatePosts/${slug}`, { token })
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenatePostsSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}

