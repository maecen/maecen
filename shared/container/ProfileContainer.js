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
      user: props.user,
      isSubmitting: false
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
      this.setState({ errors: null, isSubmitting: false })
      this.toggleEdit(false)
      dispatch(Actions.updateEntities(data.entities))
    }, (res) => {
      this.setState({ errors: res.data.errors, isSubmitting: false })
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
                  label={t('user.firstName')}
                  placeholder='Your first name'
                  disabled={!isEdit} />
              </Col>
              <Col sm={6}>
                <TextField
                  path={['name', 'last']}
                  label={t('user.lastName')}
                  placeholder='Your last name'
                  disabled={!isEdit} />
              </Col>
            </Row>

            <TextField
              path={['email']}
              label={t('user.email')}
              placeholder='Your email address'
              disabled={!isEdit} />

            <Row>
              <Col sm={6}>
                <TextField
                  path={['alias']}
                  label={t('user.alias')}
                  disabled={!isEdit} />
              </Col>
              <Col sm={6}>
                <TextField
                  path={['phoneNumber']}
                  label={t('user.phoneNumber')}
                  disabled={!isEdit} />
              </Col>
            </Row>

            <Row>
              <Col sm={6}>
                <TextField
                  path={['country']}
                  label={t('user.country')}
                  disabled={!isEdit} />
              </Col>
              <Col sm={6}>
                <TextField
                  path={['zipCode']}
                  label={t('user.zip')}
                  disabled={!isEdit} />
              </Col>
            </Row>

            { isEdit === false
              ? <span className={s.marginRight}>
                  <Button type='button'
                    onClick={this.toggleEdit.bind(this)}
                    primary={true}
                    label={t('user.edit')} />
                </span>
              : <span>
                  <span className={s.marginRight}>
                    <Button
                      label={t('user.update')}
                      type='submit'
                      primary={true}
                      disabled={this.state.isSubmitting === true} />
                  </span>
                  <span className={s.marginRight}>
                    <Button
                      flat={true}
                      onClick={this.toggleEdit.bind(this)}
                      label={t('user.cancel')} />
                  </span>
                </span>
            }

            <Button onClick={this.clearAuth.bind(this)}
              secondary={true}
              flat={true}
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
