import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import * as Actions from '../actions'
import { isAuthorized } from '../selectors/user'
import * as constants from '../container/App/App'

import UserFeedView from '../container/UserFeedView'
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
    let letMeSee = false
    const window = global.window
    if (window && window.localStorage) {
      letMeSee = window.localStorage.getItem('LetMeSee') === 'true'
    }

    return (
      <div className={s.home}>
        <Icon size='calc(12vh + 12vw)'
          viewBox='0 0 832 997'
          icon='maecen-detail'
        />
        {letMeSee
          ? <div>
              <div className={s.tagline}>{t('tagline')}</div>
              <div>
                <Link to='/maecenates' className={s.marginBottom}>
                  <Button primary={true} label={t('maecenate.seeAll')} />
                </Link>
                <Button
                  label={t('maecenate.create')}
                  primary={true}
                  onClick={this.handleCreateMaecenate}
                />
              </div>
            </div>
          : <div id='mc_embed_signup'>
              <div className={s.tagline}>{t('curiousEmail')}</div>
              <form
                action='//maecen.us9.list-manage.com/subscribe/post?u=1e4624f4f555b78ee9644d7c9&amp;id=a04ee31e14'
                method='post'
                id='mc-embedded-subscribe-form'
                name='mc-embedded-subscribe-form'
                target='_blank'
                novalidate>
                <div id='mc_embed_signup_scroll'
                  style={{maxWidth: '100%', display: 'flex', justifyContent: 'center'}}>
                  <div>
                    <input type='email'
                      name='EMAIL'
                      id='mce-EMAIL'
                      placeholder={t('user.emailPlaceholder')}
                      style={{
                        padding: '0 0.6rem',
                        width: '100%',
                        borderColor: constants.themeColor,
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderRadius: '0px',
                        display: 'inline-block',
                        outline: 'none',
                        height: '2.2rem',
                        lineHeight: '2.2rem'
                      }}
                    />
                  </div>
                  <div style={{display: 'inline-block'}}>
                    <input type='submit'
                      value={t('signUp')}
                      name='subscribe'
                      id='mc-embedded-subscribe'
                      style={{
                        backgroundColor: constants.themeColor,
                        borderWidth: '0',
                        borderRadius: '0px',
                        color: 'white',
                        display: 'inline-block',
                        height: 'calc(2.2rem + 4px)',
                        lineHeight: '2.2rem',
                        padding: '0 0.8rem'
                      }}
                    />
                  </div>
                  <div style={{position: 'absolute', left: '-5000px'}} aria-hidden='true'>
                    <input type='text'
                      name='b_1e4624f4f555b78ee9644d7c9_a04ee31e14'
                      tabindex='-1'
                      value=''/>
                  </div>
                  <div id='mce-responses'>
                    <div
                      id='mce-error-response'
                      style={{display: 'none'}}>
                    </div>
                    <div
                      id='mce-success-response'
                      style={{display: 'none'}}>
                    </div>
                  </div>
                </div>
              </form>
            </div>
        }
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
