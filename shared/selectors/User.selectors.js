import { createSelector } from 'reselect'
import find from 'lodash/find'
import {
  getSupports
} from './Support.selectors'

const getUsers = (state, props) =>
  state.entities.users

const getUserIds = (state, props) =>
  state.users.ids

export const getAuthToken = (state, props) =>
  state.users.authToken

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

export const getCurrentUsers = createSelector(
  [ getUsers, getUserIds ],
  (users, ids) => ids.map(id => users[id])
)

export const getCurrentUsersWithSupports = (maecenateSelector) =>
  createSelector(
    [ maecenateSelector, getCurrentUsers, getSupports ],
    (maecenate, users, supports) => users.map(user => {
      const support = find(supports, support =>
        support.maecenate === maecenate.id && support.user === user.id)
      return {
        ...user,
        support
      }
    })
  )
