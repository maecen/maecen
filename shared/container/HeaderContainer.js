import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as Actions from '../actions/actions'
import Header from '../components/Header/Header'
import { browserHistory } from 'react-router'
import { getUserMaecenates } from '../selectors/Maecenate.selectors'

import {
  isAuthorized, getAuthUser, getAuthUserId
} from '../selectors/User.selectors'

class HeaderContainer extends Component {
  constructor (props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
  }

  componentDidMount () {
    const { dispatch, userId } = this.props
    dispatch(Actions.fetchAdminMaecenateList(userId))
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, userId } = this.props
    if (userId !== nextProps.userId) {
      dispatch(Actions.fetchAdminMaecenateList(nextProps.userId))
    }
  }

  handleLogin () {
    const { dispatch } = this.props
    dispatch(Actions.requireAuth())
  }

  goToCreatePost () {
    browserHistory.push('/create-post')
  }

  render () {
    return <Header
      hasAuth={this.props.hasAuth}
      loginAction={this.handleLogin}
      createPost={this.goToCreatePost}
      adminMaecenates={this.props.adminMaecenates}
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
