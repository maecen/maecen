// Imports
import React, { PropTypes } from 'react'
// import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import styleVariables from '../../components/styleVariables'

// Components
import Dialog from '../../components/Dialog/Dialog'
import { Button } from '../../components/Form'

const ChangeCreditCardDialog = ({
  title,
  onAccept,
  onCancel,
  open,
  children,
  t
}) => {
  const actions = [
    <Button
      label={t('action.cancel')}
      flat={true}
      onClick={onCancel}
    />,
    <Button
      label={t('ok')}
      primary={true}
      onClick={onAccept}
    />
  ]

  return (
    <Dialog
      open={open}
      modal={true}
      actions={actions}
      title={title}
      contentStyle={style.content}
    >
      {children}
    </Dialog>
  )
}

const style = {
  content: {
    maxWidth: styleVariables.media.sm
  }
}

ChangeCreditCardDialog.propTypes = {
  title: PropTypes.string,
  onAccept: PropTypes.func,
  onCancel: PropTypes.func,
  children: PropTypes.node,
  open: PropTypes.bool.isRequired
}

export default translate(['common'])(ChangeCreditCardDialog)
