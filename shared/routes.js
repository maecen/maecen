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

const routes = (
  <Route path='/' component={App} >
    <IndexRoute component={HomeContainer} />
    <Route path='login' component={LoginContainer}/>
    <Route path='register' component={RegisterContainer}/>
    <Route path='profile' component={ProfileContainer}/>
    <Route path='create-maecenate' component={CreateMaecenateContainer}/>
    <Route path='maecenate/:slug' component={MaecenateContainer}/>
    <Route path='maecenates' component={MaecenateOverviewContainer}/>
  </Route>
)

export default routes
