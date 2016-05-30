import { createSelector } from 'reselect'
import find from 'lodash/find'
import { getAuthUserId } from './user.selectors'

const getMaecenateEntities = (state, props) =>
  state.entities.maecenates

const getMaecenateId = (state, props) =>
  state.app.maecenate

const getMaecenateIds = (state, props) =>
  state.app.maecenates

const getSlugFromPath = (state, props) =>
  props.params.slug

export const getMaecenateBySlug = createSelector(
  [ getSlugFromPath, getMaecenateEntities ],
  (slug, maecenates) => find(maecenates, maecenate => maecenate.slug === slug)
)

export const getMaecenate = createSelector(
  [ getMaecenateId, getMaecenateEntities ],
  (id, maecenates) => maecenates[id]
)

export const getMaecenates = createSelector(
  [ getMaecenateIds, getMaecenateEntities ],
  (ids, maecenates) => ids.map(id => maecenates[id])
)

export const isAuthUserMaecenateOwner = createSelector(
  [ getMaecenateBySlug, getAuthUserId ],
  (maecenate, userId) => maecenate && maecenate.creator === userId
)
