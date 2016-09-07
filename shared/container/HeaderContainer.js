// Imports
import React, { Component } from 'react'
import { connect } from 'react-redux'

import { isBrowser } from '../config'

// Actions & Selectors
import * as Actions from '../actions'
import { getUserMaecenates } from '../selectors/maecenate'
import {
  isAuthorized, getAuthUser, getAuthUserId
} from '../selectors/user'

// Components
import Header from '../components/Header/Header'
import { browserHistory } from 'react-router'

class HeaderContainer extends Component {
  constructor (props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
  }

  componentDidMount () {
    const { userId } = this.props
    this.fetchAdminMaecenates(userId)
  }

  componentWillReceiveProps (nextProps) {
    const { userId } = this.props
    if (nextProps.userId && userId !== nextProps.userId) {
      this.fetchAdminMaecenates(nextProps.userId)
    }
  }

  fetchAdminMaecenates (userId) {
    const { dispatch, hasAuth } = this.props
    if (hasAuth) {
      dispatch(Actions.fetchAdminMaecenates(userId))
    }
  }

  handleLogin () {
    const { dispatch } = this.props
    dispatch(Actions.requireAuth())
  }

  getAccess () {
    if (isBrowser) {
      window.localStorage.setItem('LetMeSee', 'true')
      browserHistory.push('/')
    }
  }

  render () {
    const hideFab = Boolean(this.props.children.props.route.hideFab)

    let hasAccess = false
    if (isBrowser) {
      hasAccess = window.localStorage.getItem('LetMeSee') === 'true'
    }

    return <Header
      hasAuth={this.props.hasAuth}
      loginAction={this.handleLogin}
      createPostUrl='/post/create'
      allMaecenatesUrl='/maecenates'
      myPageUrl='/profile'
      homeUrl='/'
      adminMaecenates={this.props.adminMaecenates}
      hideFab={hideFab}
      getAccessAction={this.getAccess}
      hasAccess={hasAccess}
    />
  }
}

function mapStateToProps (state) {
  const getMaecenates = getUserMaecenates(getAuthUserId)
  return {
    userId: getAuthUserId(state),
    hasAuth: isAuthorized(state),
    user: getAuthUser(state),
    adminMaecenates: getMaecenates(state)
  }
}

export default connect(mapStateToProps)(HeaderContainer)
