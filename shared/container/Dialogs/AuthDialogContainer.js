import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import axios from 'axios'
import Immutable from 'seamless-immutable'
import { translate } from 'react-i18next'
import * as Actions from '../../actions'

import styleVariables from '../../components/styleVariables'
import Dialog from '../../components/Dialog/Dialog'
import Form, { TextField, Button } from '../../components/Form'

class AuthDialogContainer extends React.Component {

  constructor () {
    super()
    this.state = {
      errors: null,
      user: Immutable({ }),
      isSubmitting: false,
      action: 'login',
      success: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.cancel = this.cancel.bind(this)
    this.setActionCreate = this.setAction.bind(this, 'create')
    this.setActionForgot = this.setAction.bind(this, 'forgot')
    this.setActionLogin = this.setAction.bind(this, 'login')
  }

  updateModel (path, value) {
    this.setState({
      user: this.state.user.setIn(path, value)
    })
  }

  cancel () {
    const { dispatch } = this.props
    dispatch(Actions.cancelRequireAuth())
    this.reset()
  }

  reset () {
    this.setState({
      errors: null,
      isSubmitting: false,
      action: 'login',
      user: Immutable({ }),
      success: false
    })
  }

  setAction (action) {
    this.setState({ action, success: false })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch, navToUrl } = this.props
    const { user, action } = this.state
    let data = {}
    let requestUrl = null

    if (action === 'create') {
      data = { user }
      requestUrl = '/api/createUser'
    } else if (action === 'forgot') {
      data = { email: user.email }
      requestUrl = '/api/forgotPassword'
    } else {
      data = { credentials: user }
      requestUrl = '/api/authUser'
    }

    this.setState({ errors: {}, isSubmitting: true })

    axios.post(requestUrl, data).then((res) => {
      return res.data
    }).then((data) => {
      if (action === 'forgot') {
        this.setState({ success: true })
        return
      }

      if (data.languageChanged) {
        return window.location.reload()
      }
      dispatch(Actions.setAuthUser(data.result[0], data.token, data.entities))
      // Navigate to the provided url on login success
      if (navToUrl) {
        browserHistory.push(navToUrl)
      }
      this.reset()
    }).catch((res) => {
      this.setState({ errors: res.data.errors })
    }).then(() => {
      this.setState({ isSubmitting: false })
    })
  }

  render () {
    const { user, success } = this.state
    const { t, open } = this.props

    const isCreating = this.state.action === 'create'
    const hasForgotten = this.state.action === 'forgot'
    let actionLabel = t(isCreating === true ? 'user.createUser' : 'login')
    if (hasForgotten === true) {
      actionLabel = t('user.passwordGetEmail')
    }

    return (
      <Dialog
        contentStyle={style.dialogContent}
        open={open}
        onRequestClose={this.cancel}>
        <Form onSubmit={this.handleSubmit} model={user}
          updateModel={this.updateModel.bind(this)}
          errors={this.state.errors}>

          {isCreating &&
            <div>
              <TextField
                path={['first_name']}
                label={t('user.firstName')}
              />
              <TextField
                path={['last_name']}
                label={t('user.lastName')}
              />
            </div>
          }

          {hasForgotten &&
            t('user.passwordForgotExplained')
          }

          {hasForgotten && success &&
            <div style={style.successMessage}>
              {t('user.passwordForgotSuccess', { email: user.email })}
            </div>
          }

          <TextField
            path={['email']}
            label={t('user.email')}
          />

          { hasForgotten === false &&
            <TextField
              type='password'
              path={['password']}
              label={t('user.loginPassword')}
            />
          }

          {/* Browser hack to allow users to submit by clicking `enter`-key */}
          <button style={style.hiddenSubmit} tabIndex='-1' />
          <div style={style.buttonWrap}>
            <Button type='submit'
              label={actionLabel}
              primary={true}
              last={true}
              style={style.loginButton}
              disabled={this.state.isSubmitting === true}
              onTouchTap={this.handleSubmit} />

              { isCreating === false && hasForgotten === false
                ? <div>
                    <Button label={t('user.createUser')}
                      flat={true}
                      primary={true}
                      last={true}
                      labelStyle={style.buttonSmall}
                      onTouchTap={this.setActionCreate}
                    />
                    <Button label={t('user.passwordForgot')}
                      flat={true}
                      primary={true}
                      last={true}
                      labelStyle={style.buttonSmall}
                      style={style.button}
                      onTouchTap={this.setActionForgot}
                    />
                  </div>
                : <Button label={t('action.cancel')}
                    flat={true}
                    primary={true}
                    last={true}
                    labelStyle={style.buttonSmall}
                    style={style.button}
                    onTouchTap={this.setActionLogin}
                  />
              }
          </div>
        </Form>
      </Dialog>
    )
  }
}

const style = {
  dialogContent: {
    maxWidth: styleVariables.media.xs
  },
  hiddenSubmit: {
    position: 'absolute',
    left: '-10000000px',
    width: '1px',
    height: '1px'
  },
  buttonWrap: {
    marginTop: styleVariables.spacer.base,
    marginBottom: '-' + styleVariables.spacer.base,
    textAlign: 'center'
  },
  loginButton: {
    width: '100%',
    marginBottom: styleVariables.spacer.half
  },
  buttonSmall: {
    fontSize: '11px'
  },
  successMessage: {
    color: styleVariables.color.primary,
    textAlign: 'center',
    padding: '0.5rem 0 0'
  }
}

AuthDialogContainer.propTypes = {
  open: PropTypes.bool.isRequired,
  navToUrl: PropTypes.string
}

function mapStateToProps (store) {
  return { }
}

export default translate(['common'])(
  connect(mapStateToProps)(AuthDialogContainer)
)
