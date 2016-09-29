// Imports
import Immutable from 'seamless-immutable'
import { combineReducers } from 'redux'

// Utils
import { apiRequest } from '../lib/request'

// Actions
// =======
export const actionTypes = {
  FETCH_DETAILS_REQUEST: 'maecen/maecenates/FETCH_DETAILS_REQUEST',
  FETCH_DETAILS_SUCCESS: 'maecen/maecenates/FETCH_DETAILS_SUCCESS',
  FETCH_DETAILS_FAILURE: 'maecen/maecenates/FETCH_DETAILS_FAILURE',

  FETCH_OVERVIEW_REQUEST: 'maecen/maecenates/FETCH_OVERVIEW_REQUEST',
  FETCH_OVERVIEW_SUCCESS: 'maecen/maecenates/FETCH_OVERVIEW_SUCCESS',
  FETCH_OVERVIEW_FAILURE: 'maecen/maecenates/FETCH_OVERVIEW_FAILURE'
}

// Reducer
// =======
const detailsById = (state = Immutable({}), action) => {
  switch (action.type) {
    case actionTypes.FETCH_DETAILS_SUCCESS:
      return {
        ...state,
        ...action.response.entities.maecenateDetails
      }
    default:
      return state
  }
}

const overviewIds = (state = Immutable([]), action) => {
  switch (action.type) {
    case actionTypes.FETCH_OVERVIEW_SUCCESS:
      return action.response.result
    default:
      return state
  }
}

const reducer = combineReducers({
  detailsById,
  overviewIds
})

export default reducer

// Action Creators
// ===============
export const fetchMaecenateDetails = (slug) => (dispatch, state) => {
  dispatch({
    type: actionTypes.FETCH_DETAILS_REQUEST,
    slug
  })

  return apiRequest(state, `/maecenates/${slug}/admin/details`)
  .then(response => dispatch({
    type: actionTypes.FETCH_DETAILS_SUCCESS,
    response
  }))
  .catch(error => dispatch({
    type: actionTypes.FETCH_DETAILS_FAILURE,
    error
  }))
}

export const fetchMaecenatesOverview = () => (dispatch, state) => {
  dispatch({
    type: actionTypes.FETCH_OVERVIEW_REQUEST
  })

  return apiRequest(state, '/maecenates')
  .then(response => dispatch({
    type: actionTypes.FETCH_OVERVIEW_SUCCESS,
    response,
    entities: response.entities
  }))
  .catch(error => dispatch({
    type: actionTypes.FETCH_OVERVIEW_FAILURE,
    error
  }))
}
