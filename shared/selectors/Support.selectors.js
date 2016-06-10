import { createSelector } from 'reselect'
import find from 'lodash/find'
import {
  getAuthUserId
} from './User.selectors'

const getUserSupports = (state, props) =>
  state.entities.userSupports

export const isAuthUserMaecenateSupporter = (maecenateSelector) => {
  return createSelector(
    [ maecenateSelector, getAuthUserId, getUserSupports ],
    (maecenate, userId, supports) =>
      !!find(supports, support =>
        support.user === userId && support.maecenate === maecenate.id)
  )
}
