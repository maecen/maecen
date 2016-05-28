import { createSelector } from 'reselect'

const getUsers = (state, props) =>
  state.entities.users

export const getAuthUserId = (state, props) =>
  state.app.authUser

export const isAuthorized = createSelector(
  [ getAuthUserId ],
  (authUserId) => !!authUserId
)

export const getAuthUser = createSelector(
  [ getAuthUserId, getUsers ],
  (id, users) => users[id]
)
