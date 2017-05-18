// Imports
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import without from 'lodash/without'

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

  changeLang (event, index, value) {
    const { i18n } = this.context
    const currLang = i18n.language
    const lang = value
    const { dispatch } = this.props
    dispatch(Actions.changeLanguage(lang, currLang))
  }

  render () {
    const hideFab = Boolean(this.props.children.props.route.hideFab)

    const { i18n } = this.context
    const langOptions = without(i18n.options.whitelist, 'cimode')
    const currLang = i18n.language
    const showLangSwitch = Boolean(this.props.children.props.route.showLangSwitch)

    return <Header
      hasAuth={this.props.hasAuth}
      loginAction={this.handleLogin}
      createPostUrl='/post/create'
      allMaecenatesUrl='/maecenates'
      myPageUrl='/profile'
      homeUrl='/'
      adminMaecenates={this.props.adminMaecenates}
      hideFab={hideFab}
      changeLang={this.changeLang.bind(this)}
      langOptions={langOptions}
      currLang={currLang}
      showLangSwitch={showLangSwitch}
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

HeaderContainer.contextTypes = {
  i18n: PropTypes.object.isRequired
}

export default connect(mapStateToProps)(HeaderContainer)
