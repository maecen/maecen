import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as Actions from '../actions/actions'
import Header from '../components/Header/Header'
import { browserHistory } from 'react-router'
import { getUserMaecenates } from '../selectors/maecenate'

import {
  isAuthorized, getAuthUser, getAuthUserId
} from '../selectors/user'

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
    const { dispatch } = this.props
    dispatch(Actions.fetchAdminMaecenates(userId))
  }

  handleLogin () {
    const { dispatch } = this.props
    dispatch(Actions.requireAuth())
  }

  gotoCreatePost () {
    browserHistory.push('/post/create')
  }

  render () {
    const hideFab = Boolean(this.props.children.props.route.hideFab)
    return <Header
      hasAuth={this.props.hasAuth}
      loginAction={this.handleLogin}
      createPost={this.gotoCreatePost}
      adminMaecenates={this.props.adminMaecenates}
      hideFab={hideFab}
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
