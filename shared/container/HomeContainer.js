import React, { Component } from 'react'
import HeaderContainer from './HeaderContainer'
import FooterContainer from './FooterContainer'
import Icon from '../components/Graphics/Icon'

import { Link } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

class HomeContainer extends Component {
  render () {
    const { t } = this.props

    return (
      <div>
        <HeaderContainer />
        <div className='container'>
          <Icon size='10rem' viewBox='0 0 832 997' icon='maecen-detail' />
          {t('maecen')}
          <br />
          {t('tagline')}
          <Link to='/maecenates'>{t('maecenate.seeAll')}</Link>
        </div>
        <FooterContainer />
      </div>
    )
  }
}

HomeContainer.need = []
HomeContainer.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps (store) {
  return { }
}

export default translate(['common'])(
  connect(mapStateToProps)(HomeContainer)
)
