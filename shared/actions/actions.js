import { browserHistory } from 'react-router'
import * as ActionTypes from '../constants/constants'
import * as sharedConfig from '../../shared/config'
import axios from 'axios'

const baseURL = (typeof window === 'undefined' ? sharedConfig.host : '') + '/api'

export function setAuthUser (id, entities) {
  return {
    type: ActionTypes.SET_AUTH_USER,
    id,
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
  return (dispatch) => {
    axios.post(`${baseURL}/clearAuth`)
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
  return (dispatch) => {
    return axios.get(`${baseURL}/getMaecenate/${slug}`)
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenateSuccess(data)))
      .catch(err => console.log(err.stack))
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
  return (dispatch) => {
    return axios.get(`${baseURL}/getMaecenates`)
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenateListSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}

export function fetchUserMaecenateList (userId) {
  return (dispatch) => {
    return axios.get(`${baseURL}/getUserMaecenates/${userId}`)
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenateListSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}

export function fetchSupportedMaecenateList (userId) {
  return (dispatch) => {
    return axios.get(`${baseURL}/getSupportedMaecenates/${userId}`)
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenateListSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}

export function changeLanguage (lang) {
  return (dispatch) => {
    return axios.put(`${baseURL}/setUserLanguage`, { lng: lang })
      .then(res => res.data)
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
  return (dispatch) => {
    dispatch(setPosts([], null))
    return axios.get(`${baseURL}/getMaecenatePosts/${slug}`)
      .then(res => res.data)
      .then(data => dispatch(fetchMaecenatePostsSuccess(data)))
      .catch(err => console.log(err.stack))
  }
}

