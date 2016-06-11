import { Route, IndexRoute } from 'react-router'
import React from 'react'
import axios from 'axios'
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
  const slug = nextState.params.slug
  axios(`/api/hasPermission/maecenateAdmin/${slug}`)
    .then(res => {
      cb()
    }).catch(res => {
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
    <Route path='/' component={App} >
      <IndexRoute component={HomeContainer} />
      <Route path='profile' component={MyPageView} />
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
