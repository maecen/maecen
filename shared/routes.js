import { Route, IndexRoute } from 'react-router'
import React from 'react'
import App from './container/App/App'

import HomeContainer from './container/HomeContainer'
import CreateMaecenateContainer from './container/CreateMaecenateContainer'
import MaecenateOverviewContainer from './container/MaecenateOverviewContainer'

import MaecenateView from './container/MaecenateView'
import MaecenatePostView from './container/MaecenatePostView'
import MaecenateContentView from './container/MaecenateContentView'

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

const getRoutes = (store) => {
  const connect = (fn) => (nextState, replaceState, cb) => (
    fn(store, nextState, replaceState, cb)
  )

  const requiresAuth = connect(requiresAuthFn)

  return (
    <Route path='/' component={App} >
      <IndexRoute component={HomeContainer} />
      <Route path='profile' component={MyPageView} />
      <Route path='create-maecenate'
        component={CreateMaecenateContainer} onEnter={requiresAuth} />
      <Route path='maecenates' component={MaecenateOverviewContainer} />
      <Route path='maecenate/:slug' component={MaecenateView} />
      <Route path='maecenate/:slug/new-post' component={MaecenatePostView} />
      <Route path='maecenate/:slug/content' component={MaecenateContentView} />
    </Route>
  )
}

export default getRoutes
