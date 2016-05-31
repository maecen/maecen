import { createSelector } from 'reselect'
import filter from 'lodash/filter'
import { getPostMediaEntities } from './PostMedia.selectors'

const getPostEntities = (state, props) =>
  state.entities.posts

const getPostIds = (state, props) =>
  state.app.posts

const getPostMedia = (postMediaEntities, postId) =>
  filter(postMediaEntities, m => m.post === postId)

export const getPosts = createSelector(
  [ getPostIds, getPostEntities, getPostMediaEntities ],
  (ids, posts, postMediaEntities) =>
    ids.map(id => ({
      ...posts[id],
      media: getPostMedia(postMediaEntities, id)
    }))
)

