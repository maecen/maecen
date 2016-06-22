import { createSelector } from 'reselect'
import { getMediaEntities } from './media'

const getPostEntities = (state, props) =>
  state.entities.posts

const getPostIds = (state, props) =>
  state.app.posts

const getPostId = (state, props) =>
  props.params.postId

export const getPosts = createSelector(
  [ getPostIds, getPostEntities, getMediaEntities ],
  (ids, posts, mediaEntities) =>
    ids.map(id => posts[id])
)

export const getPostById = createSelector(
  [ getPostId, getPostEntities, getMediaEntities ],
  (id, posts, mediaEntities) => posts[id]
)
