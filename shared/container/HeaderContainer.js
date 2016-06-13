import React, { Component } from 'react'
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
  }

  handleLogin () {
    const { dispatch } = this.props
    dispatch(Actions.requireAuth())
  }

  render () {
    return <Header
      hasAuth={this.props.hasAuth}
      loginAction={this.handleLogin}
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
