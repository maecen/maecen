import { createSelector } from 'reselect'
import find from 'lodash/find'
import filter from 'lodash/filter'
import { getAuthUserId } from './user'
import { getSupports } from './support'

export const getMaecenateEntities = (state, props) =>
  state.entities.maecenates

const getMaecenateId = (state, props) =>
  state.app.maecenate

const getMaecenateIds = (state, props) =>
  state.app.maecenates

const getSlugFromPath = (state, props) =>
  props.params.slug

export const getMaecenateBySlug = createSelector(
  [ getSlugFromPath, getMaecenateEntities ],
  (slug, maecenates) =>
    find(maecenates, maecenate => maecenate.slug === slug)
)

export const getMaecenateByPost = (postSelector) =>
  createSelector(
    [ postSelector, getMaecenateEntities ],
    (post, maecenates) => maecenates[post.maecenate]
  )

export const getMaecenate = createSelector(
  [ getMaecenateId, getMaecenateEntities ],
  (id, maecenates) => (
    maecenates[id]
  )
)

export const getMaecenates = createSelector(
  [ getMaecenateIds, getMaecenateEntities ],
  (ids, maecenates) => ids.map(id => maecenates[id])
)

export const getUserMaecenates = (userIdSelector) =>
  createSelector(
    [ userIdSelector, getMaecenateEntities ],
    (userId, maecenates) =>
      filter(maecenates, maecenate => maecenate.creator === userId)
  )

export const getSupportedMaecenates = (userIdSelector) =>
  createSelector(
    [ userIdSelector, getMaecenateEntities, getSupports ],
    (userId, maecenates, supports) =>
      filter(supports, support => support.user === userId)
        .map(support => maecenates[support.maecenate])
  )

// Factory selectors, which depends upon a maecenate selector method
export const isAuthUserMaecenateOwner = (maecenateSelector) => {
  return createSelector(
    [ maecenateSelector, getAuthUserId ],
    (maecenate, userId) => maecenate && maecenate.creator === userId
  )
}

