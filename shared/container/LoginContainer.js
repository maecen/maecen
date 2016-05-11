import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, browserHistory } from 'react-router'
import axios from 'axios'
import Immutable from 'seamless-immutable'
import { translate } from 'react-i18next'
import HeaderContainer from './HeaderContainer'
import * as Actions from '../actions/actions'

import Form from '../components/Form/Form'
import TextField from '../components/Form/TextField'
import Button from '../components/Form/Button'

class LoginContainer extends Component {

  constructor () {
    super()
    this.state = {
      errors: null,
      credentials: Immutable({ })
    }
  }

  updateModel (path, value) {
    this.setState({
      credentials: this.state.credentials.setIn(path, value)
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch } = this.props
    const { credentials } = this.state

    axios.post('/api/authUser', { credentials }).then((res) => {
      return res.data
    }).then((data) => {
      dispatch(Actions.setAuthUser(data.result[0], data.entities))
      browserHistory.push('/')
    }, (res) => {
      this.setState({ errors: res.data.errors })
    })
  }

  render () {
    const { credentials } = this.state
    const { t } = this.props

    return (
      <div>
        <HeaderContainer />
        <div className='container'>

          <Form onSubmit={this.handleSubmit.bind(this)} model={credentials}
            updateModel={this.updateModel.bind(this)}
            errors={this.state.errors}>

            <TextField
              path={['email']}
              label={t('user.email')}
              placeholder={t('user.emailPlaceholder')}/>

            <TextField
              type='password'
              path={['password']}
              label={t('user.loginPassword')}
              placeholder={t('user.loginPasswordPlaceholder')}/>

            <Button type='submit' label='Login'/>
          </Form>
          <Link to='/register'>Register</Link>

        </div>
      </div>
    )
  }
}

LoginContainer.need = []
LoginContainer.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps (store) {
  return { }
}

export default translate(['common'])(
  connect(mapStateToProps)(LoginContainer)
)
