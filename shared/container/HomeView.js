import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import * as Actions from '../actions/actions'
import { isAuthorized } from '../selectors/User.selectors'

import Icon from '../components/Graphics/Icon'
import Button from '../components/Form/Button'
import s from './HomeView.scss'

class HomeView extends Component {
  constructor (props) {
    super(props)
    this.handleCreateMaecenate = this.handleCreateMaecenate.bind(this)
  }

  handleCreateMaecenate () {
    const { dispatch, hasAuth } = this.props
    const path = '/create-maecenate'
    if (hasAuth === true) {
      browserHistory.push(path)
    } else {
      dispatch(Actions.requireAuth(path))
    }
  }

  render () {
    const { t } = this.props

    return (
      <div className={s.home}>
        <Icon size='calc(12vh + 12vw)'
          viewBox='0 0 832 997'
          icon='maecen-detail'
        />
        <div className={s.tagline}>{t('tagline')}</div>
        <Link to='/maecenates' className={s.marginBottom}>
          <Button primary={true} label={t('maecenate.seeAll')} />
        </Link>
        <Button
          label={t('maecenate.create')}
          primary={true}
          onClick={this.handleCreateMaecenate}
        />
      </div>
    )
  }
}

HomeView.need = []
HomeView.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps (state) {
  return {
    hasAuth: isAuthorized(state)
  }
}

export default translate(['common'])(
  connect(mapStateToProps)(HomeView)
)
