import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Immutable from 'seamless-immutable'
import { translate } from 'react-i18next'

import HeaderContainer from './HeaderContainer'
import FooterContainer from './FooterContainer'
import Form from '../components/Form/Form'
import TextField from '../components/Form/TextField'
import Button from '../components/Form/Button'

class RegisterContainer extends Component {

  constructor () {
    super()
    this.state = {
      errors: null,
      user: Immutable({ })
    }
  }

  updateModel (path, value) {
    this.setState({
      user: this.state.user.setIn(path, value)
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const userData = this.state.user
    const user = userData.without('confirmPassword')
    const confirmPassword = userData.confirmPassword

    if (confirmPassword !== user.password) {
      this.setState({
        errors: { confirmPassword: 'The two passwords doesn\'t match' }
      })
      return
    }

    axios.post('/api/createUser', { user }).then((res) => {
      this.setState({ errors: null, user: Immutable({ }) })
    }, (res) => {
      this.setState({ errors: res.data.errors })
    })
  }

  render () {
    const { user } = this.state
    const { t } = this.props

    return (
      <div>
        <HeaderContainer />
        <div className='container'>

          <Form onSubmit={this.handleSubmit.bind(this)} model={user}
            updateModel={this.updateModel.bind(this)}
            errors={this.state.errors}>

            <TextField
              path={['name', 'first']}
              label={t('user.firstName')}
              placeholder={t('user.firstNamePlaceholder')} />

            <TextField
              path={['name', 'last']}
              label={t('user.lastName')}
              placeholder={t('user.lastNamePlaceholder')} />

            <TextField
              path={['email']}
              label={t('user.email')}
              placeholder={t('user.emailPlaceholder')} />

            <TextField
              type='password'
              path={['password']}
              label={t('user.password')}
              placeholder={t('user.passwordPlaceholder')} />

            <TextField
              type='password'
              path={['confirmPassword']}
              label={t('user.confirmPassword')}
              placeholder={t('user.confirmPasswordPlaceholder')} />

            <Button type='submit' label={t('user.buttonRegisterUser')} />
          </Form>
        </div>
        <FooterContainer />
      </div>
    )
  }
}

RegisterContainer.need = []
RegisterContainer.contextTypes = {
  router: React.PropTypes.object
}

function mapStateToProps (store) {
  return { }
}

export default translate(['common'])(
  connect(mapStateToProps)(RegisterContainer)
)
