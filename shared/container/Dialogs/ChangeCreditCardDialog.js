// Imports
import React, { Component, PropTypes } from 'react'
// import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import styleVariables from '../../components/styleVariables'

// Components
import Dialog from '../../components/Dialog/Dialog'
import { Button } from '../../components/Form'

class ChangeCreditCardDialog extends Component {
  constructor (props) {
    super(props)
    this.state = {
    }
  }

  render () {
    const { t } = this.props

    const actions = [
      <Button
        label={t('ok')}
        primary={true}
      />
    ]

    return (
      <Dialog
        open={this.props.open}
        onRequestClose={this.props.close}
        contentStyle={style.dialogContent}
        actions={actions}
        title='Hej'
      >

      </Dialog>
    )
  }
}

const style = {
  dialogContent: {
    maxWidth: styleVariables.media.sm
  }
}

ChangeCreditCardDialog.propTypes = {
  close: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default translate(['common'])(
  ChangeCreditCardDialog
)
