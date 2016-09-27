import { createSelector } from 'reselect'
import filter from 'lodash/filter'
import { getSupports } from './support'

const getUsers = (state, props) =>
  state.entities.users

const getUserIds = (state, props) =>
  state.users.ids

export const getAuthToken = (state, props) =>
  state.users.authToken

export const getAuthUserId = (state, props) =>
  state.users.authUser

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

export const hasSavedPaymentCard = (userSelector) =>
  createSelector(
    [ userSelector ],
    (user) => Boolean(user && user.epay_subscription_id)
  )

export const getSupportingUsers = (maecenateSelector) =>
  createSelector(
    [ maecenateSelector, getUsers, getSupports ],
    (maecenate, users, supports) =>
      filter(supports, support => support.maecenate === maecenate.id)
        .map(support => ({
          ...users[support.user],
          support
        }))

  )

