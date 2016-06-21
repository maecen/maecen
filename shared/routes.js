import { Route, IndexRoute } from 'react-router'
import React from 'react'
import App from './container/App/App'

import HomeView from './container/HomeView'
import CreateMaecenateView from './container/CreateMaecenateView'
import MaecenateOverviewView from './container/MaecenateOverviewView'

import MaecenateView from './container/MaecenateView'
import CreatePostView from './container/Post/CreatePostView'
import EditPostView from './container/Post/EditPostView'
import MaecenateSupportView from './container/MaecenateSupportView'

import MaecenateDashboardView from './container/MaecenateDashboardView'
import MyPageView from './container/MyPage/MyPageView'
import { apiURL } from '../shared/config'
import { isAuthorized, getAuthToken } from './selectors/user'
import request from './lib/request'

const requiresAuthFn = (store, nextState, replaceState, cb) => {
  const hasAuth = isAuthorized(store.getState())
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
      <IndexRoute component={HomeView} />
      <Route path='profile' component={MyPageView} onEnter={requiresAuth} />
      <Route path='create-maecenate'
        component={CreateMaecenateView} onEnter={requiresAuth} />
      <Route path='create-post' component={CreatePostView} />
      <Route path='maecenates' component={MaecenateOverviewView} />
      <Route path='maecenate/:slug' component={MaecenateView} />
      <Route path='maecenate/:slug/presentation' presentation={true} component={MaecenateView} />
      <Route path='maecenate/:slug/support' component={MaecenateSupportView} />
      <Route path='maecenate/:slug/dashboard' component={MaecenateDashboardView}
        onEnter={requiresMaecenateAdmin} />
    </Route>
  )
}

export default getRoutes
