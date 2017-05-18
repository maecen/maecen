import React, { Component, PropTypes } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import without from 'lodash/without'
import * as Actions from '../actions'
import Footer from '../components/Footer/Footer'

import { isAuthorized, getAuthUser } from '../selectors/user'

class FooterContainer extends Component {
  render () {
    return (
      <Footer
        hasAuth={this.props.hasAuth}
        user={this.props.user} />
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
