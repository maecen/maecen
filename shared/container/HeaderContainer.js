import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from '../components/Header/Header'

class HeaderContainer extends Component {
  render () {
    return <Header hasAuth={this.props.hasAuth} user={this.props.user} />
  }
}

function mapStateToProps (store) {
  const { app, entities } = store
  const hasAuth = !!app.authUser
  const user = hasAuth && entities.users[app.authUser]

  return {
    hasAuth,
    user
  }
}

export default connect(mapStateToProps)(HeaderContainer)
