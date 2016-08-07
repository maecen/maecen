import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import axios from 'axios'
import Immutable from 'seamless-immutable'
import { translate } from 'react-i18next'
import { Row, Col } from 'react-flexbox-grid/lib'
import * as Actions from '../actions'

import Dialog from '../components/Dialog/Dialog'
import Form, { TextField, Button } from '../components/Form'
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

class AuthDialogContainer extends React.Component {

  constructor () {
    super()
    this.state = {
      errors: null,
      user: Immutable({ }),
      isSubmitting: false,
      action: 'login'
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.cancel = this.cancel.bind(this)
    this.setActionCreate = this.setAction.bind(this, 'create')
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
      user: Immutable({ })
    })
  }

  setAction (action) {
    this.setState({ action })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch, navToUrl } = this.props
    const { user } = this.state
    let data = {}
    let requestUrl = null

    if (this.state.action === 'create') {
      data = { user }
      requestUrl = '/api/createUser'
    } else {
      data = { credentials: user }
      requestUrl = '/api/authUser'
    }

    axios.post(requestUrl, data).then((res) => {
      return res.data
    }).then((data) => {
      dispatch(Actions.setAuthUser(data.result[0], data.token, data.entities))

      // Navigate to the provided url on login success
      if (navToUrl) {
        browserHistory.push(navToUrl)
      }
      this.reset()
    }, (res) => {
      this.setState({ errors: res.data.errors, isSubmitting: false })
    })
  }

  render () {
    const { user } = this.state
    const { t, open } = this.props

    const isCreating = this.state.action === 'create'
    const actionLabel = t(isCreating === true ? 'user.createUser' : 'login')

    const actions = [
      (isCreating === false &&
        <Button label={t('user.createUser')}
          flat={true}
          primary={true}
          onClick={this.setActionCreate} />),
      <Button type='submit'
        label={actionLabel}
        primary={true}
        last={true}
        disabled={this.state.isSubmitting === true}
        onClick={this.handleSubmit} />
    ]

    return (
      <Dialog
        open={open}
        actions={actions}
        onRequestClose={this.cancel}
        title={actionLabel}>
        <IconButton style={{position: 'absolute', right: '0px', top: '0px'}} onClick={this.cancel}>
          <NavigationClose />
        </IconButton>
        <Form onSubmit={this.handleSubmit} model={user}
          updateModel={this.updateModel.bind(this)}
          errors={this.state.errors}>

          {isCreating &&
            <Row>
              <Col xs={12} sm={6}>
                <TextField
                  path={['first_name']}
                  label={t('user.firstName')} />
              </Col>
              <Col xs={12} sm={6}>
                <TextField
                  path={['last_name']}
                  label={t('user.lastName')} />
              </Col>
            </Row>
          }

          <TextField
            path={['email']}
            label={t('user.email')} />

          <TextField
            type='password'
            path={['password']}
            label={t('user.loginPassword')} />

          {/* Browser hack to allow users to submit by clicking `enter`-key */}
          <button style={{
            position: 'absolute',
            left: '-10000000px',
            width: '1px',
            height: '1px'
          }} tabindex='-1' />

        </Form>
      </Dialog>
    )
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
