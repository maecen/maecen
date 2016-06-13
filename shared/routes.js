import { Route, IndexRoute } from 'react-router'
import React from 'react'
import App from './container/App/App'

import HomeContainer from './container/HomeContainer'
import CreateMaecenateView from './container/CreateMaecenateView'
import MaecenateOverviewContainer from './container/MaecenateOverviewContainer'

import MaecenateView from './container/MaecenateView'
import CreatePostView from './container/CreatePostView'
import MaecenateContentView from './container/MaecenateContentView'
import MaecenateSupportView from './container/MaecenateSupportView'

import MaecenateDashboardView from './container/MaecenateDashboardView'
import MyPageView from './container/MyPage/MyPageView'
import { apiURL } from '../shared/config'
import { getAuthToken } from './selectors/User.selectors'
import request from './lib/request'

const selectHasAuth = state => !!state.app.authUser

const requiresAuthFn = (store, nextState, replaceState, cb) => {
  const hasAuth = selectHasAuth(store.getState())
  if (hasAuth === false) {
    replaceState('/')
    cb()
  } else {
    cb()
  }
}

const requiresMaecenateAdminFn = (store, nextState, replaceState, cb) => {
  const token = getAuthToken(store.getState())
  const slug = nextState.params.slug
  request(`${apiURL}/hasPermission/maecenateAdmin/${slug}`, { token })
  .then(res => {
    cb()
  }).catch(() => {
    replaceState('/')
    cb()
  })
}

const getRoutes = (store) => {
  const connect = (fn) => (nextState, replaceState, cb) => (
    fn(store, nextState, replaceState, cb)
  )

  const requiresAuth = connect(requiresAuthFn)
  const requiresMaecenateAdmin = connect(requiresMaecenateAdminFn)

  return (
    <Route path='/' component={App}>
      <IndexRoute component={HomeContainer} />
      <Route path='profile' component={MyPageView} onEnter={requiresAuth} />
      <Route path='create-maecenate'
        component={CreateMaecenateView} onEnter={requiresAuth} />
      <Route path='maecenates' component={MaecenateOverviewContainer} />
      <Route path='maecenate/:slug' component={MaecenateView} />
      <Route path='maecenate/:slug/new-post' component={CreatePostView} />
      <Route path='maecenate/:slug/content' component={MaecenateContentView} />
      <Route path='maecenate/:slug/support' component={MaecenateSupportView} />
      <Route path='maecenate/:slug/dashboard' component={MaecenateDashboardView}
        onEnter={requiresMaecenateAdmin} />
    </Route>
  )
}

export default getRoutes
