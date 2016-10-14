// Imports
import React, { Component } from 'react'
import { connect } from 'react-redux'

// Actions & Selectors
import * as Actions from '../actions'
import { getUserMaecenates } from '../selectors/maecenate'
import {
  isAuthorized, getAuthUser, getAuthUserId
} from '../selectors/user'

// Components
import Header from '../components/Header/Header'

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

  render () {
    const hideFab = Boolean(this.props.children.props.route.hideFab)

    return <Header
      hasAuth={this.props.hasAuth}
      loginAction={this.handleLogin}
      createPostUrl='/post/create'
      allMaecenatesUrl='/maecenates'
      myPageUrl='/profile'
      homeUrl='/'
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
