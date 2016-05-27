import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import ContentWrapper from '../components/ContentWrapper/ContentWrapper'
import Icon from '../components/Graphics/Icon'
import Button from '../components/Form/Button'
import s from './HomeContainer.scss'

class HomeContainer extends Component {
  render () {
    const { t } = this.props

    return (
      <ContentWrapper>
        <div className={s.home}>
          <Icon size='calc(12vh + 12vw)'
            viewBox='0 0 832 997'
            icon='maecen-detail'
          />
          <div className={s.tagline}>{t('tagline')}</div>
          <Link to='/maecenates'>
            <Button primary={true} label={t('mc.seeAll')} />
          </Link>
        </div>
      </ContentWrapper>
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
