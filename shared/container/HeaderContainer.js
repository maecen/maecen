import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import * as Actions from '../actions/actions'
import Header from '../components/Header/Header'

import {
  isAuthorized, getAuthUser
} from '../selectors/User.selectors'

class HeaderContainer extends Component {
  constructor (props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleCreateMaecenate = this.handleCreateMaecenate.bind(this)
  }

  handleLogin () {
    const { dispatch } = this.props
    dispatch(Actions.requireAuth())
  }

  handleCreateMaecenate () {
    const { dispatch, hasAuth } = this.props
    const path = '/create-maecenate'
    if (hasAuth === true) {
      browserHistory.push(path)
    } else {
      dispatch(Actions.requireAuth(path))
    }
  }

  render () {
    return <Header
      hasAuth={this.props.hasAuth}
      loginAction={this.handleLogin}
      createMaecenateAction={this.handleCreateMaecenate}
    />
  }
}

function mapStateToProps (state) {
  return {
    hasAuth: isAuthorized(state),
    user: getAuthUser(state)
  }
}

export default connect(mapStateToProps)(HeaderContainer)
