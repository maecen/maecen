import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import * as Actions from '../actions'
import { isAuthorized } from '../selectors/user'
import { isBrowser } from '../config'

import styleVariables from '../components/styleVariables'
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
    if (isBrowser) {
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
                  className={s.marginBottom}
                  label={t('maecenate.create')}
                  primary={true}
                  onClick={this.handleCreateMaecenate}
                />
                <Link to='/about'>
                  <Button primary={true} label={t('aboutMaecen')} />
                </Link>
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
                style={{marginBottom: '1rem'}}
                novalidate>
                <div id='mc_embed_signup_scroll'
                  style={{
                    maxWidth: '20rem',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'center',
                    borderColor: styleVariables.color.primary,
                    borderWidth: '2px',
                    borderRadius: '2px',
                    borderStyle: 'solid'
                  }}>
                  <input type='email'
                    name='EMAIL'
                    id='mce-EMAIL'
                    placeholder={t('user.emailPlaceholder')}
                    style={{
                      flexGrow: '2',
                      padding: '0 0.6rem',
                      width: '100%',
                      display: 'inline-block',
                      outline: 'none',
                      height: '2.2rem',
                      lineHeight: '2.2rem',
                      border: '0px'
                    }}
                  />
                  <input type='submit'
                    value={t('signUp')}
                    name='subscribe'
                    id='mc-embedded-subscribe'
                    style={{
                      backgroundColor: styleVariables.color.primary,
                      borderWidth: '0px',
                      borderRadius: '0px',
                      color: 'white',
                      display: 'inline-block',
                      height: '2.2rem',
                      lineHeight: '2.2rem',
                      padding: '0 0.8rem',
                      fontSize: '14px',
                      fontWeight: '500',
                      flexShrink: '0',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase'
                    }}
                  />
                  <div style={{position: 'absolute', left: '-5000px'}} aria-hidden='true'>
                    <input type='text'
                      name='b_1e4624f4f555b78ee9644d7c9_a04ee31e14'
                      tabIndex='-1'
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
              <Link to='/about'>
                <Button primary={true} label={t('aboutMaecen')} />
              </Link>
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
