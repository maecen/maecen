import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { translate } from 'react-i18next'
import { Row, Cell } from '../../components/Grid'
import * as Actions from '../../actions'

import { getAuthUser } from '../../selectors/user'

import styleVariables from '../../components/styleVariables'
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

    this.setState({ errors: {} })

    axios.post('/api/updateAuthUser', {
      user: user.without(['epay_subscription_id', 'payment_card'])
    }).then((res) => {
      return res.data
    }).then((data) => {
      this.setState({ isSubmitting: false })
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
            style={style.cardTitle}
          />
          <CardContent>
            { isEdit === false &&
              <IconButton
                style={style.iconButton}
                onTouchTap={this.toggleEdit.bind(this)}>
                <EditIcon />
              </IconButton>
            }
            <Form onSubmit={this.handleSubmit.bind(this)} model={user}
              updateModel={this.updateModel.bind(this)}
              errors={this.state.errors}
            >
              <Row>
                <Cell md='1/2'>
                  <TextField
                    path={['first_name']}
                    floatingLabelText={t('user.firstName')}
                    disabled={!isEdit} />
                </Cell>
                <Cell md='1/2'>
                  <TextField
                    path={['last_name']}
                    floatingLabelText={t('user.lastName')}
                    disabled={!isEdit} />
                </Cell>
                <Cell md='1/2'>
                  <TextField
                    path={['email']}
                    floatingLabelText={t('user.email')}
                    disabled={!isEdit} />
                </Cell>
                <Cell md='1/2'>
                  <TextField
                    type='password'
                    path={['password']}
                    autoComplete='new-password'
                    floatingLabelText={t('user.passwordNew')}
                  disabled={!isEdit} />
                </Cell>
              </Row>

              <Row>
                <Cell md='1/4'>
                  <TextField
                    path={['alias']}
                    floatingLabelText={t('user.alias')}
                    disabled={!isEdit} />
                </Cell>
                <Cell md='1/4'>
                  <TextField
                    path={['phone_number']}
                    floatingLabelText={t('user.phoneNumber')}
                    disabled={!isEdit} />
                </Cell>
                <Cell md='1/4'>
                  <TextField
                    path={['country']}
                    floatingLabelText={t('user.country')}
                    disabled={!isEdit} />
                </Cell>
                <Cell md='1/4'>
                  <TextField
                    path={['zip_code']}
                    floatingLabelText={t('user.zip')}
                    disabled={!isEdit} />
                </Cell>
              </Row>

              <Row>
                <Cell xs={12}>
                  { isEdit === true &&
                    <div style={style.buttons}>
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
                    </div>
                  }
                </Cell>
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

const style = {
  iconButton: {
    marginRight: '0px',
    position: 'absolute',
    top: '0px',
    right: '0px'
  },
  cardTitle: {
    paddingBottom: '0px'
  },
  buttons: {
    marginTop: styleVariables.spacer.base,
    textAlign: 'right'
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
