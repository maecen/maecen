import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import without from 'lodash/without'
import * as Actions from '../actions/actions'
import Footer from '../components/Footer/Footer'

class FooterContainer extends Component {
  changeLang (e) {
    e.preventDefault()
    const { dispatch } = this.props
    const lang = e.target.value
    dispatch(Actions.changeLanguage(lang))
  }

  render () {
    const { i18n } = this.context
    const langOptions = without(i18n.options.whitelist, 'cimode')
    const currLang = i18n.language
    return (
      <Footer
        lang={currLang}
        langOptions={langOptions}
        changeLang={this.changeLang.bind(this)} />
    )
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

FooterContainer.contextTypes = {
  i18n: PropTypes.object.isRequired
}

export default translate(['common'])(
  connect(mapStateToProps)(FooterContainer)
)
