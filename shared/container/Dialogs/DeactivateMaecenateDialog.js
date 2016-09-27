// Imports
import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
// import moment from 'moment'

import styleVariables from '../../components/styleVariables'

// Actions
import { deactivateMaecenate } from '../../actions/maecenateActions'

// Components
import Checkbox from 'material-ui/Checkbox'
import Dialog from '../../components/Dialog/Dialog'
import { Button, TextField, ErrorMessage } from '../../components/Form'

class DeactivateMaecenateDialog extends Component {
  constructor (props) {
    super(props)
    this.state = {
      errors: null,
      isSubmitting: false,
      confirm: false,
      message: ''
    }

    this.deactivateMaecenate = this.deactivateMaecenate.bind(this)
    this.checkConfirm = this.checkConfirm.bind(this)
    this.changeMessage = this.changeMessage.bind(this)
  }

  checkConfirm (event, confirm) {
    this.setState({ confirm })
  }

  changeMessage (event, message) {
    this.setState({ message })
  }

  isValid () {
    return this.state.message.length > 0 && this.state.confirm
  }

  deactivateMaecenate () {
    if (this.isValid()) {
      this.setState({ isSubmitting: true, errors: null })
      const message = this.state.message
      this.props.deactivateMaecenate(this.props.maecenate.slug, message)
      .then(() => {
        this.props.close()
      })
      .catch(res => {
        console.log(res)
        this.setState({ errors: res.data.errors })
      })
      .then(() => {
        this.setState({ isSubmitting: false })
      })
    }
  }

  render () {
    const { t, maecenate } = this.props
    const isValid = this.isValid()

    const actions = [
      <Button
        label={t('maecenate.close')}
        onClick={this.deactivateMaecenate}
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
        title={t('maecenate.closeTitle', { title: maecenate.title })}
      >
        <ErrorMessage message={this.state.errors && this.state.errors._} />

        <TextField
          label={t('maecenate.closeMaecenMessageLabel')}
          placeholder={t('maecenate.closeMaecenMessagePlaceholder')}
          rows={2}
          multiLine={true}
          onChange={this.changeMessage}
        />

        <Checkbox
          label={t('maecenate.closeAcceptance')}
          onCheck={this.checkConfirm}
        />
      </Dialog>
    )
  }
}

const style = {
  dialogContent: {
    maxWidth: styleVariables.media.sm
  }
}

DeactivateMaecenateDialog.propTypes = {
  maecenate: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  close: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default translate(['common'])(
  connect(null, { deactivateMaecenate })(DeactivateMaecenateDialog)
)
