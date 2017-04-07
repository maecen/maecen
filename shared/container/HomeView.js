import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import * as Actions from '../actions'
import { isAuthorized } from '../selectors/user'

import styleVariables from '../components/styleVariables'
import UserFeedView from '../container/UserFeedView'
import Icon from '../components/Graphics/Icon'
import Button from '../components/Form/Button'
import HomeInfo from './HomeInfo';

class HomeView extends Component {
  constructor (props) {
    super(props)
    this.handleCreateMaecenate = this.handleCreateMaecenate.bind(this)
  }

  handleCreateMaecenate () {
    const { dispatch, hasAuth } = this.props
    const path = '/maecenate/create'
    if (hasAuth === true) {
      browserHistory.push(path)
    } else {
      dispatch(Actions.requireAuth(path))
    }
  }

  handleChange (event) {
    this.setState({emailInput: event.target.value})
  }

  renderDefaultHome () {
    const { t } = this.props

    return (
      <div style={style.home}>
        <Icon size='calc(12vh + 12vw)'
          viewBox='0 0 832 997'
          icon='maecen-detail'
        />
        <div style={style.tagline}>{t('tagline')}</div>
        <div style={style.buttonPadding}>
          <Button
            label={t('maecenate.create')}
            primary={true}
            last={true}
            onClick={this.handleCreateMaecenate}
          />
        </div>
        <HomeInfo />
      </div>
    )
  }

  render () {
    const { hasAuth } = this.props

    if (hasAuth === false) {
      return this.renderDefaultHome()
    } else {
      return <UserFeedView />
    }
  }
}

const { color } = styleVariables

const style = {
  buttonPadding: {
    padding: styleVariables.spacer.quart,
    display: 'inline-block'
  },
  home: {
    color: color.textColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    minHeight: '100%',
    width: '100%',
    textAlign: 'center'
  },
  tagline: {
    fontSize: 'calc(.8rem + .5vw + .5vh)',
    fontStyle: 'italic',
    fontweight: 300,
    letterSpacing: '.02rem',
    marginBottom: '3rem',
    marginTop: '3rem'
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
