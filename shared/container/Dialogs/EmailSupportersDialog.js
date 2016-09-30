// Imports
import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import styleVariables from '../../components/styleVariables'

// Actions
import { sendEmailToSupporters } from '../../ducks/maecenates'

// Components
import Dialog from '../../components/Dialog/Dialog'
import { Button, TextField, ErrorMessage } from '../../components/Form'

class EmailSupportersDialog extends Component {
  constructor (props) {
    super(props)
    this.state = {
      errors: null,
      isSubmitting: false,
      message: '',
      subject: ''
    }

    this.submit = this.submit.bind(this)
    this.change = this.change.bind(this)
  }

  change (event) {
    this.setState({[event.target.name]: event.target.value})
  }

  isValid () {
    return this.state.message && this.state.subject
  }

  submit () {
    if (this.isValid()) {
      this.setState({ isSubmitting: true, errors: null })
      const { message, subject } = this.state
      const { maecenate: { slug } } = this.props

      this.props.sendEmailToSupporters(slug, subject, message)
      .then(() => this.props.close())
      .catch(res => this.setState({ errors: res.data.errors }))
      .then(() => this.setState({ isSubmitting: false }))
    }
  }

  render () {
    const { t } = this.props
    const isValid = this.isValid()

    const actions = [
      <Button
        label={t('maecenate.admin.sendEmail')}
        onClick={this.submit}
        primary={true}
        disabled={!isValid || this.state.isSubmitting}
      />
    ]

    return (
      <Dialog
        open={this.props.open}
        onRequestClose={this.props.close}
        contentStyle={style.dialogContent}
        actions={actions}
        title={t('maecenate.admin.emailSupporters')}
      >
        <ErrorMessage message={this.state.errors && this.state.errors._} />

        <form onChange={this.change}>
          <TextField label={t('maecenate.admin.emailSubject')} name='subject'/>
          <TextField
            label={t('maecenate.admin.messageToSupporters')}
            rows={1}
            multiLine={true}
            name='message'
          />
        </form>
      </Dialog>
    )
  }
}

const style = {
  dialogContent: {
    maxWidth: styleVariables.media.sm
  }
}

EmailSupportersDialog.propTypes = {
  maecenate: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  close: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default translate(['common'])(
  connect(null, { sendEmailToSupporters })(EmailSupportersDialog)
)
