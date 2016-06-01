import { createSelector } from 'reselect'
import filter from 'lodash/filter'
import { getMediaEntities } from './Media.selectors'

const getPostEntities = (state, props) =>
  state.entities.posts

const getPostIds = (state, props) =>
  state.app.posts

const getMedia = (mediaEntities, postId) =>
  filter(mediaEntities, m => m.obj_id === postId)

export const getPosts = createSelector(
  [ getPostIds, getPostEntities, getMediaEntities ],
  (ids, posts, mediaEntities) =>
    ids.map(id => ({
      ...posts[id],
      media: getMedia(mediaEntities, id)
    }))
)

