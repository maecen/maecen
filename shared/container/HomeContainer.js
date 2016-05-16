import React, { Component } from 'react'
import HeaderContainer from './HeaderContainer'
import FooterContainer from './FooterContainer'
import Icon from '../components/Graphics/Icon'
import Button from '../components/Form/Button'
import s from './HomeContainer.scss'

import { Link } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

class HomeContainer extends Component {
  render () {
    const { t } = this.props

    return (
      <div className='wrapper'>
        <HeaderContainer />
        <div className='container'>
          <div className={s.home}>
            <Icon size='calc(12vh + 12vw)'
              viewBox='0 0 832 997'
              icon='maecen-detail'
            />
            <div className={s.tagline}>{t('tagline')}</div>
            <Link to='/maecenates'>
              <Button label={t('maecenate.seeAll')} />
            </Link>
          </div>
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
