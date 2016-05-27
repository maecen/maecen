import { createSelector } from 'reselect'

export const getAuthUserId = (state, props) =>
  state.app.authUser

export const isAuthorized = createSelector(
  [ getAuthUserId ],
  (authUserId) => !!authUserId
)
