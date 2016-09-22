import React, { PropTypes } from 'react'
import styleVariables from '../styleVariables'

const ErrorMessage = ({ message }) => {
  if (message) {
    return (
      <div style={style.error}>{message}</div>
    )
  } else {
    return null
  }
}

const style = {
  error: {
    color: styleVariables.color.alert,
    padding: `0px ${styleVariables.spacer.base}`
  }
}

ErrorMessage.propTypes = {
  message: PropTypes.string
}

export default ErrorMessage
