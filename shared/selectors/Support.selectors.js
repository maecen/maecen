import { createSelector } from 'reselect'
import find from 'lodash/find'
import {
  getAuthUserId
} from './User.selectors'

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

