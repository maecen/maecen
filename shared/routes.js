import { Route, IndexRoute } from 'react-router'
import React from 'react'
import App from './container/App/App'

import HomeContainer from './container/HomeContainer'
import LoginContainer from './container/LoginContainer'
import RegisterContainer from './container/RegisterContainer'
import ProfileContainer from './container/ProfileContainer'
import CreateMaecenateContainer from './container/CreateMaecenateContainer'
import MaecenateContainer from './container/MaecenateContainer'
import MaecenateOverviewContainer from './container/MaecenateOverviewContainer'

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
      <Route path='login' component={LoginContainer}/>
      <Route path='register' component={RegisterContainer}/>
      <Route path='profile' component={ProfileContainer}/>
      <Route path='create-maecenate'
        component={CreateMaecenateContainer} onEnter={requiresAuth} />
      <Route path='maecenate/:slug' component={MaecenateContainer}/>
      <Route path='maecenates' component={MaecenateOverviewContainer}/>
    </Route>
  )
}

export default getRoutes
