import * as ActionTypes from '../constants/constants'
import * as Actions from './actions'
import { apiRequest } from '../lib/request'

// Private Actions
// ===============
function fetchMaecenateSuccess (data) {
  const id = data.result[0]

  return {
    type: ActionTypes.SET_MAECENATE,
    id,
    entities: data.entities
  }
}

// Fetch Maecenate List
// --------------------
function fetchMaecenateListSuccess (data) {
  const ids = data.result

  return {
    type: ActionTypes.SET_MAECENATE_LIST,
    ids,
    entities: data.entities
  }
}

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
    return apiRequest(state, `/getMaecenate/${slug}`)
      .then(data => dispatch(fetchMaecenateSuccess(data)))
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
      .then(data => dispatch(Actions.updateEntities(data.entities)))
  }
}

export function fetchSupportedMaecenates (userId) {
  return (dispatch, state) => {
    return apiRequest(state, `/getSupportedMaecenates/${userId}`)
      .then(data => dispatch(Actions.updateEntities(data.entities)))
  }
}

export function fetchMaecenateSupporter (slug) {
  return (dispatch, state) => {
    return apiRequest(state, `/getMaecenateSupporters/${slug}`)
      .then(data => dispatch(Actions.updateEntities(data.entities)))
  }
}

export function deactivateMaecenate (id, message) {
  return (dispatch, state) => {
    return apiRequest(state, `/maecenates/${id}/deactivate`, {
      method: 'PUT',
      data: { message }
    })
    .then(data => dispatch(Actions.updateEntities(data.entities)))
  }
}
