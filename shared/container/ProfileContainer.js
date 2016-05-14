import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { translate } from 'react-i18next'
import HeaderContainer from './HeaderContainer'
import FooterContainer from './FooterContainer'
import * as Actions from '../actions/actions'

import Form from '../components/Form/Form'
import TextField from '../components/Form/TextField'
import Button from '../components/Form/Button'

class ProfileContainer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      errors: null,
      isEdit: false,
      user: props.user
    }
  }

  updateModel (path, value) {
    const user = this.state.user.setIn(path, value)
    this.setState({user})
  }

  toggleEdit (newState) {
    const { isEdit } = this.state

    if (typeof newState === 'boolean') {
      this.setState({ isEdit: newState })
    } else {
      this.setState({ isEdit: !isEdit })
    }
  }

  clearAuth () {
    const { dispatch } = this.props
    dispatch(Actions.clearAuth())
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch } = this.props
    const { user } = this.state

    axios.post('/api/updateAuthUser', { user }).then((res) => {
      return res.data
    }).then((data) => {
      this.setState({ errors: null })
      this.toggleEdit(false)
      dispatch(Actions.updateEntities(data.entities))
    }, (res) => {
      this.setState({ errors: res.data.errors })
    })
  }

  render () {
    const { isEdit, user } = this.state
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
              label='First Name'
              placeholder='Your first name'
              disabled={!isEdit} />
            <br />

            <TextField
              path={['name', 'last']}
              label='Last Name'
              placeholder='Your last name'
              disabled={!isEdit} />
            <br />

            <TextField
              path='email'
              label='Email'
              placeholder='Your email address'
              disabled={!isEdit} />
            <br />

            { isEdit === false
              ? <Button type='button'
                  onClick={this.toggleEdit.bind(this)}
                  label='Edit profile' />
              : <div>
                  <Button
                    onClick={this.toggleEdit.bind(this)}
                    label='Cancel' />
                  <Button label='Update' primary={true} />
                </div>
            }

            <Button onClick={this.clearAuth.bind(this)}
              label={t('logout')} />
          </Form>

        </div>
        <FooterContainer />
      </div>
    )
  }
}

ProfileContainer.need = []

function mapStateToProps (store) {
  const { app, entities } = store
  const user = entities.users[app.authUser] || null

  return {
    user
  }
}

export default translate(['common'])(
  connect(mapStateToProps)(ProfileContainer)
)
