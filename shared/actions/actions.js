import { browserHistory } from 'react-router'
import { actionTypes as appActionTypes } from '../ducks/app'
import { actionTypes as userActionTypes } from '../ducks/users'
import { actionTypes as entityActionTypes } from '../ducks/entities'
import { apiRequest } from '../lib/request'

// Public Actions
// ==============
export function setAuthUser (id, token, entities) {
  return {
    type: userActionTypes.SET_AUTH,
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
    type: userActionTypes.CLEAR_AUTH
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

export function fetchAuthUser () {
  return (dispatch, state) => {
    return apiRequest(state, '/getAuthUser')
      .then(data => dispatch(updateEntities(data.entities)))
  }
}

export function requireAuth (url) {
  url = url || null

  return {
    type: appActionTypes.REQUIRE_AUTHORIZATION,
    url
  }
}

export function cancelRequireAuth () {
  return {
    type: appActionTypes.CANCEL_REQUIRE_AUTHORIZATION
  }
}

export function updateEntities (entities) {
  return {
    type: entityActionTypes.UPDATE,
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
