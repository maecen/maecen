import { createSelector } from 'reselect'
import find from 'lodash/find'
import filter from 'lodash/filter'
import { getAuthUserId } from './user'
import { getMediaEntities } from './media'
import { getSupports } from './support'

export const getMaecenateEntities = (state, props) =>
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
  const logo = media[maecenate.logo_media]
  return {
    ...maecenate,
    cover: (cover
      ? { url: cover.url, type: cover.type }
      : null),
    logo: (logo
      ? { url: logo.url, type: logo.type }
      : null)
  }
}

export const getMaecenateBySlug = createSelector(
  [ getSlugFromPath, getMaecenateEntities, getMediaEntities ],
  (slug, maecenates, media) => {
    const maecenate = find(maecenates, maecenate => maecenate.slug === slug)
    return withMedia(maecenate, media)
  }
)

export const getMaecenateByPost = (postSelector) =>
  createSelector(
    [ postSelector, getMaecenateEntities ],
    (post, maecenates) => maecenates[post.maecenate]
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

export const getUserMaecenates = (userIdSelector) =>
  createSelector(
    [ userIdSelector, getMaecenateEntities, getMediaEntities ],
    (userId, maecenates, media) =>
      filter(maecenates, maecenate => maecenate.creator === userId)
        .map(maecenate => withMedia(maecenate, media))
  )

export const getSupportedMaecenates = (userIdSelector) =>
  createSelector(
    [ userIdSelector, getMaecenateEntities, getSupports, getMediaEntities ],
    (userId, maecenates, supports, media) =>
      filter(supports, support => support.user === userId)
        .map(support => withMedia(maecenates[support.maecenate], media))
  )

// Factory selectors, which depends upon a maecenate selector method
export const isAuthUserMaecenateOwner = (maecenateSelector) => {
  return createSelector(
    [ maecenateSelector, getAuthUserId ],
    (maecenate, userId) => maecenate && maecenate.creator === userId
  )
}

