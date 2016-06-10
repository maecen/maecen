import { createSelector } from 'reselect'
import find from 'lodash/find'
import { getAuthUserId } from './User.selectors'
import { getMediaEntities } from './Media.selectors'

const getMaecenateEntities = (state, props) =>
  state.entities.maecenates

const getMaecenateId = (state, props) =>
  state.app.maecenate

const getMaecenateIds = (state, props) =>
  state.app.maecenates

const getSlugFromPath = (state, props) =>
  props.params.slug

const withMedia = (maecenate, media) => {
  if (typeof maecenate === 'undefined') {
    return maecenate
  }

  const cover = media[maecenate.cover_media]
  return {
    ...maecenate,
    cover_url: cover && cover.url,
    cover_type: cover && cover.type
  }
}

export const getMaecenateBySlug = createSelector(
  [ getSlugFromPath, getMaecenateEntities, getMediaEntities ],
  (slug, maecenates, media) => {
    const maecenate = find(maecenates, maecenate => maecenate.slug === slug)
    return withMedia(maecenate, media)
  }
)

export const getMaecenate = createSelector(
  [ getMaecenateId, getMaecenateEntities, getMediaEntities ],
  (id, maecenates, media) => (
    withMedia(maecenates[id], media)
  )
)

export const getMaecenates = createSelector(
  [ getMaecenateIds, getMaecenateEntities, getMediaEntities ],
  (ids, maecenates, media) => ids.map(id =>
    withMedia(maecenates[id], media)
  )
)

// Factory selectors, which depends upon a maecenate selector method
export const isAuthUserMaecenateOwner = (maecenateSelector) => {
  return createSelector(
    [ maecenateSelector, getAuthUserId ],
    (maecenate, userId) => maecenate && maecenate.creator === userId
  )
}

