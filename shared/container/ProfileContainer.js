import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { translate } from 'react-i18next'
import HeaderContainer from './HeaderContainer'
import * as Actions from '../actions/actions'

import Form from '../components/Form/Form'
import TextField from '../components/Form/TextField'

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
              readOnly={!isEdit} />

            <TextField
              path={['name', 'last']}
              label='Last Name'
              placeholder='Your last name'
              readOnly={!isEdit} />

            <TextField
              path='email'
              label='Email'
              placeholder='Your email address'
              readOnly={!isEdit} />

            { isEdit === false
              ? <button type='button'
                  onClick={this.toggleEdit.bind(this)}>Edit profile</button>
              : <div>
                  <button type='button'
                    onClick={this.toggleEdit.bind(this)}>Cancel</button>
                  <button>Update</button>
                </div>
            }

            <button type='button' onClick={this.clearAuth.bind(this)}>
              {t('logout')}
            </button>
          </Form>

        </div>
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
