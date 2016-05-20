import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import axios from 'axios'
import Immutable from 'seamless-immutable'
import { translate } from 'react-i18next'
import Dialog from 'material-ui/Dialog'
import { Row, Col } from 'react-flexbox-grid/lib'
import * as Actions from '../actions/actions'

import Form from '../components/Form/Form'
import TextField from '../components/Form/TextField'
import Button from '../components/Form/Button'

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
      dispatch(Actions.setAuthUser(data.result[0], data.entities))

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
      <Button label={t('user.cancel')}
        onClick={this.cancel}
        secondary={true}
        flat={true} />,
      (isCreating === false &&
        <Button label={t('user.createUser')}
          flat={true}
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
        <Form onSubmit={this.handleSubmit} model={user}
          updateModel={this.updateModel.bind(this)}
          errors={this.state.errors}>

          {isCreating &&
            <Row>
              <Col sm={6}>
                <TextField
                  path={['name', 'first']}
                  label={t('user.firstName')} />
              </Col>
              <Col sm={6}>
                <TextField
                  path={['name', 'last']}
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
