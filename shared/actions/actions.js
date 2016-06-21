import { browserHistory } from 'react-router'
import * as ActionTypes from '../constants/constants'
import request from '../lib/request'
import { getAuthToken } from '../selectors/user'
import { apiURL } from '../config'

function apiRequest (state, url, options) {
  const token = getAuthToken(state())
  return request(apiURL + url, { token, ...options })
    .then(res => res.data)
    .catch(err => console.log(err.stack))
}

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
    apiRequest(state, '/clearAuth', { method: 'POST' })
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
    return apiRequest(state, `/getMaecenate/${slug}`)
      .then(data => dispatch(fetchMaecenateSuccess(data)))
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
    return apiRequest(state, '/getMaecenates')
      .then(data => dispatch(fetchMaecenateListSuccess(data)))
  }
}

export function fetchAdminMaecenateList (userId) {
  return (dispatch, state) => {
    return apiRequest(state, `/getUserMaecenates/${userId}`)
      .then(data => dispatch(fetchMaecenateListSuccess(data)))
  }
}

export function fetchAdminMaecenates (userId) {
  return (dispatch, state) => {
    return apiRequest(state, `/getUserMaecenates/${userId}`)
      .then(data => dispatch(updateEntities(data.entities)))
  }
}

export function fetchSupportedMaecenates (userId) {
  return (dispatch, state) => {
    return apiRequest(state, `/getSupportedMaecenates/${userId}`)
      .then(data => dispatch(updateEntities(data.entities)))
  }
}

export function fetchMaecenateSupporterList (slug) {
  return (dispatch, state) => {
    return apiRequest(state, `/getMaecenateSupporters/${slug}`)
      .then(data => dispatch(fetchUserListSuccess(data)))
  }
}

export function changeLanguage (lang) {
  return (dispatch, state) => {
    return apiRequest(state, '/setUserLanguage', {
      method: 'PUT',
      data: { lng: lang }
    }).then(res => {
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
    return apiRequest(state, `/getMaecenatePosts/${slug}`)
      .then(data => dispatch(fetchMaecenatePostsSuccess(data)))
  }
}

