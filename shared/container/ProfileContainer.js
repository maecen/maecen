import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { translate } from 'react-i18next'
import { Row, Col } from 'react-flexbox-grid/lib'
import ContentWrapper from '../components/ContentWrapper/ContentWrapper'
import * as Actions from '../actions/actions'
import s from './ProfileContainer.scss'

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
      <ContentWrapper>
        <div className={s.card}>
          <Form onSubmit={this.handleSubmit.bind(this)} model={user}
            updateModel={this.updateModel.bind(this)}
            errors={this.state.errors}>

            <Row>
              <Col sm={6}>
                <TextField
                  path={['name', 'first']}
                  label='First Name'
                  placeholder='Your first name'
                  disabled={!isEdit} />
              </Col>
              <Col sm={6}>
                <TextField
                  path={['name', 'last']}
                  label='Last Name'
                  placeholder='Your last name'
                  disabled={!isEdit} />
              </Col>
            </Row>

            <TextField
              path={['email']}
              label='Email'
              placeholder='Your email address'
              disabled={!isEdit} />

            <Row>
              <Col sm={6}>
                <TextField
                  path={['alias']}
                  label='Alias'
                  disabled={!isEdit} />
              </Col>
              <Col sm={6}>
                <TextField
                  path={['phoneNumber']}
                  label='Phone number'
                  disabled={!isEdit} />
              </Col>
            </Row>

            <Row>
              <Col sm={6}>
                <TextField
                  path={['country']}
                  label='Country'
                  disabled={!isEdit} />
              </Col>
              <Col sm={6}>
                <TextField
                  path={['zipCode']}
                  label='Zip code'
                  disabled={!isEdit} />
              </Col>
            </Row>

            { isEdit === false
              ? <span className={s.marginRight}>
                  <Button type='button'
                  onClick={this.toggleEdit.bind(this)}
                  label='Edit profile' />
                </span>
              : <span>
                  <span className={s.marginRight}>
                    <Button label='Update' type='submit'
                      primary={true} />
                  </span>
                  <span className={s.marginRight}>
                    <Button
                      onClick={this.toggleEdit.bind(this)}
                      label='Cancel' />
                  </span>
                </span>
            }

            <Button onClick={this.clearAuth.bind(this)}
              label={t('logout')} />
          </Form>
        </div>
      </ContentWrapper>
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
