import { createSelector } from 'reselect'

const getPostEntities = (state, props) =>
  state.entities.posts

const getPostIds = (state, props) =>
  state.app.posts

export const getPosts = createSelector(
  [ getPostIds, getPostEntities ],
  (ids, posts) => ids.map(id => posts[id])
)

