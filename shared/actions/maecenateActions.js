import { actionTypes as appActionTypes } from '../ducks/app'
import * as Actions from './actions'
import { apiRequest } from '../lib/request'

// Public Actions
// ==============
export function createMaecenateSuccess (data) {
  return (dispatch) => {
    dispatch(Actions.updateEntities(data.entities))
  }
}

export function editMaecenateSuccess (data) {
  return (dispatch) => {
    dispatch(Actions.updateEntities(data.entities))
  }
}

export function fetchMaecenate (slug) {
  return (dispatch, state) => {
    return apiRequest(state, `/maecenates/${slug}`)
      .then(data => dispatch(Actions.updateEntities(data.entities)))
      .catch(res => {
        if (res.status === 404) {
          dispatch({
            type: appActionTypes.FETCH_MAECENATE_FAILURE,
            status: res.status
          })
        }
      })
  }
}

export function fetchAdminMaecenateList (userId) {
  return (dispatch, state) => {
    return apiRequest(state, `/users/${userId}/admin-maecenates`)
      .then(data => dispatch(Actions.updateEntities(data.entities)))
  }
}

export function fetchAdminMaecenates (userId) {
  return (dispatch, state) => {
    return apiRequest(state, `/users/${userId}/admin-maecenates`)
      .then(data => dispatch(Actions.updateEntities(data.entities)))
  }
}

export function fetchSupportedMaecenates (userId) {
  return (dispatch, state) => {
    return apiRequest(state, `/users/${userId}/supported-maecenates`)
      .then(data => dispatch(Actions.updateEntities(data.entities)))
  }
}

export function fetchMaecenateSupporter (slug) {
  return (dispatch, state) => {
    return apiRequest(state, `/maecenates/${slug}/admin/supporters`)
      .then(data => dispatch(Actions.updateEntities(data.entities)))
  }
}

export function deactivateMaecenate (slug, message) {
  return (dispatch, state) => {
    return apiRequest(state, `/maecenates/${slug}/admin/deactivate`, {
      method: 'PUT',
      data: { message }
    })
    .then(data => dispatch(Actions.updateEntities(data.entities)))
  }
}
