import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { translate } from 'react-i18next'
import { Row, Col } from 'react-flexbox-grid/lib'
import * as Actions from '../../actions'

import { getAuthUser } from '../../selectors/user'

import { Card, CardContent, CardTitle } from '../../components/Card'
import Form from '../../components/Form/Form'
import TextField from '../../components/Form/TextField'
import Button from '../../components/Form/Button'
import IconButton from 'material-ui/IconButton'
import EditIcon from 'material-ui/svg-icons/editor/mode-edit'

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
      <div>
        <Card>
          <CardTitle
            title={t('user.yourProfile')}
            style={{paddingBottom: '0px'}}
          />
          <CardContent>
            { isEdit === false &&
              <IconButton
                style={{marginRight: '0px', position: 'absolute', top: '0px', right: '0px'}}
                onTouchTap={this.toggleEdit.bind(this)}>
                <EditIcon />
              </IconButton>
            }
            <Form onSubmit={this.handleSubmit.bind(this)} model={user}
              updateModel={this.updateModel.bind(this)}
              errors={this.state.errors}
            >
              <Row>
                <Col xs={12} sm={3}>
                  <TextField
                    path={['first_name']}
                    placeholder={t('user.firstName')}
                    disabled={!isEdit} />
                </Col>
                <Col xs={12} sm={3}>
                  <TextField
                    path={['last_name']}
                    placeholder={t('user.lastName')}
                    disabled={!isEdit} />
                </Col>
                <Col xs={12} sm={6}>
                  <TextField
                    path={['email']}
                    placeholder={t('user.email')}
                    disabled={!isEdit} />
                </Col>
              </Row>

              <Row>
                <Col xs={12} sm={3}>
                  <TextField
                    path={['alias']}
                    placeholder={t('user.alias')}
                    disabled={!isEdit} />
                </Col>
                <Col xs={12} sm={3}>
                  <TextField
                    path={['phone_number']}
                    placeholder={t('user.phoneNumber')}
                    disabled={!isEdit} />
                </Col>
                <Col xs={12} sm={3}>
                  <TextField
                    path={['country']}
                    placeholder={t('user.country')}
                    disabled={!isEdit} />
                </Col>
                <Col xs={12} sm={3}>
                  <TextField
                    path={['zip_code']}
                    placeholder={t('user.zip')}
                    disabled={!isEdit} />
                </Col>
              </Row>

              <Row style={{marginTop: '16px', textAlign: 'right'}}>
                <Col xs={12}>
                  { isEdit === true &&
                    <span>
                      <Button
                        flat={true}
                        primary={true}
                        onClick={this.toggleEdit.bind(this)}
                        label={t('action.cancel')} />
                      <Button
                        last={true}
                        label={t('post.saveEdit')}
                        type='submit'
                        primary={true}
                        disabled={this.state.isSubmitting === true} />
                    </span>
                  }
                </Col>
              </Row>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardContent style={{textAlign: 'right'}}>
            <Button onClick={this.clearAuth.bind(this)}
              primary={true}
              flat={true}
              last={true}
              label={t('logout')} />
          </CardContent>
        </Card>
      </div>
    )
  }
}

ProfileContainer.need = []

function mapStateToProps (state, props) {
  return {
    user: getAuthUser(state, props)
  }
}

export default translate(['common'])(
  connect(mapStateToProps)(ProfileContainer)
)
