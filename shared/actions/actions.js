import { browserHistory } from 'react-router'
import * as ActionTypes from '../constants/constants'
import { apiRequest } from '../lib/request'

// Public Actions
// ==============
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

export function changeLanguage (lang, currLang) {
  if (lang !== currLang) {
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
}
