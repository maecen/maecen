import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { translate } from 'react-i18next'
import { Row, Col } from 'react-flexbox-grid/lib'
import * as Actions from '../../actions/actions'

import { Card, CardContent, CardTitle } from '../../components/Card'
import Form from '../../components/Form/Form'
import TextField from '../../components/Form/TextField'
import Button from '../../components/Form/Button'

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
      <Card>
        <CardTitle title={t('user.profilePage')} />
        <CardContent>
          <Form onSubmit={this.handleSubmit.bind(this)} model={user}
            updateModel={this.updateModel.bind(this)}
            errors={this.state.errors}
          >
            <Row>
              <Col sm={6} xs={12}>
                <TextField
                  path={['first_name']}
                  placeholder={t('user.firstName')}
                  disabled={!isEdit} />
              </Col>
              <Col sm={6} xs={12}>
                <TextField
                  path={['last_name']}
                  placeholder={t('user.lastName')}
                  disabled={!isEdit} />
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <TextField
                  path={['email']}
                  placeholder={t('user.email')}
                  disabled={!isEdit} />
              </Col>
            </Row>

            <Row>
              <Col sm={6} xs={12}>
                <TextField
                  path={['alias']}
                  placeholder={t('user.alias')}
                  disabled={!isEdit} />
              </Col>
              <Col sm={6} xs={12}>
                <TextField
                  path={['phoneNumber']}
                  placeholder={t('user.phoneNumber')}
                  disabled={!isEdit} />
              </Col>
            </Row>

            <Row>
              <Col sm={6} xs={12}>
                <TextField
                  path={['country']}
                  placeholder={t('user.country')}
                  disabled={!isEdit} />
              </Col>
              <Col sm={6} xs={12}>
                <TextField
                  path={['zipCode']}
                  placeholder={t('user.zip')}
                  disabled={!isEdit} />
              </Col>
            </Row>

            <Row>
              <Col sm={6} xs={12}>
                { isEdit === false
                  ? <Button type='button'
                      onClick={this.toggleEdit.bind(this)}
                      primary={true}
                      label={t('user.edit')} />

                  : <span>
                      <Button
                        label={t('user.update')}
                        type='submit'
                        primary={true}
                        disabled={this.state.isSubmitting === true} />
                      <Button
                        flat={true}
                        onClick={this.toggleEdit.bind(this)}
                        label={t('user.cancel')} />
                    </span>
                }
                <Button onClick={this.clearAuth.bind(this)}
                  secondary={true}
                  flat={true}
                  label={t('logout')} />
              </Col>
            </Row>
          </Form>
        </CardContent>
      </Card>
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
