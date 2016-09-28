import { createSelector } from 'reselect'
import find from 'lodash/find'
import filter from 'lodash/filter'
import { getAuthUserId } from './user'
import { getSupports } from './support'

export const getMaecenateEntities = (state, props) =>
  state.entities.maecenates

const getMaecenateOverviewIds = (state, props) =>
  state.maecenates.overviewIds

const getDetails = (state) => state.maecenates.detailsById

const getMaecenatePropId = (state, props) =>
  props.maecenateId

const getSlugFromPath = (state, props) =>
  props.params.slug

export const getMaecenateBySlug = createSelector(
  [ getSlugFromPath, getMaecenateEntities ],
  (slug, maecenates) =>
    find(maecenates, maecenate => maecenate.slug === slug)
)

export const getMaecenateById = createSelector(
  [ getMaecenatePropId, getMaecenateEntities ],
  (id, maecenates) => find(maecenates, maecenate => maecenate.id === id)
)

export const getMaecenateDetails = createSelector(
  [ getDetails, getMaecenateBySlug ],
  (details, maecenate) => details[maecenate.id]
)

export const getMaecenateByPost = (postSelector) =>
  createSelector(
    [ postSelector, getMaecenateEntities ],
    (post, maecenates) => maecenates[post.maecenate]
  )

export const getOverviewMaecenates = createSelector(
  [ getMaecenateOverviewIds, getMaecenateEntities ],
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
        .map(support => ({
          ...maecenates[support.maecenate],
          support
        }))
  )

// Factory selectors, which depends upon a maecenate selector method
export const isAuthUserMaecenateOwner = (maecenateSelector) => {
  return createSelector(
    [ maecenateSelector, getAuthUserId ],
    (maecenate, userId) => maecenate && maecenate.creator === userId
  )
}

