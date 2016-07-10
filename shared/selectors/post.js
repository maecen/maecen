import { createSelector } from 'reselect'
import { getMaecenateEntities } from './maecenate'

const getPostEntities = (state, props) =>
  state.entities.posts

const getPostIds = (state, props) =>
  state.posts.ids

const getPostId = (state, props) =>
  props.params.postId

export const getPosts = createSelector(
  [ getPostIds, getPostEntities, getMaecenateEntities ],
  (ids, posts, maecenates) =>
    ids.map(id => ({
      ...posts[id],
      maecenate: maecenates[posts[id].maecenate]
    }))
)

export const getPostById = createSelector(
  [ getPostId, getPostEntities ],
  (id, posts) => posts[id]
)
