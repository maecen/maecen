import { createSelector } from 'reselect'
import find from 'lodash/find'
import { getAuthUserId } from './user'

export const getSupports = (state, props) =>
  state.entities.supports

export const isAuthUserMaecenateSupporter = (maecenateSelector) => {
  return createSelector(
    [ maecenateSelector, getAuthUserId, getSupports ],
    (maecenate, userId, supports) =>
      !!find(supports, support =>
        support.user === userId && support.maecenate === maecenate.id)
  )
}

export const getAuthUserSupportForMaecenate = (maecenateSelector) =>
  createSelector(
    [ maecenateSelector, getAuthUserId, getSupports ],
    (maecenate, userId, supports) =>
      find(supports, support =>
        maecenate &&
        support.user === userId &&
        support.maecenate === maecenate.id)
  )
