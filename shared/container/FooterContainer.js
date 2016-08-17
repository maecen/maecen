import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import without from 'lodash/without'
import * as Actions from '../actions'
import Footer from '../components/Footer/Footer'

import { isAuthorized, getAuthUser } from '../selectors/user'

class FooterContainer extends Component {
  changeLang (event, index, value) {
    const { i18n } = this.context
    const currLang = i18n.language
    const lang = value
    const { dispatch } = this.props
    dispatch(Actions.changeLanguage(lang, currLang))
  }

  render () {
    const { i18n } = this.context
    const langOptions = without(i18n.options.whitelist, 'cimode')
    const currLang = i18n.language
    const showLangSwitch = Boolean(this.props.children.props.route.showLangSwitch)
    return (
      <Footer
        hasAuth={this.props.hasAuth}
        user={this.props.user}
        showLangSwitch={showLangSwitch}
        lang={currLang}
        langOptions={langOptions}
        changeLang={this.changeLang.bind(this)} />
    )
  }
}

function mapStateToProps (state, props) {
  return {
    hasAuth: isAuthorized(state, props),
    user: getAuthUser(state, props)
  }
}

FooterContainer.contextTypes = {
  i18n: PropTypes.object.isRequired
}

export default translate(['common'])(
  connect(mapStateToProps)(FooterContainer)
)
