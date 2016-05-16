import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import MaterialFlatButton from 'material-ui/FlatButton'

export default function Button (props, context) {
  props = Immutable(props)

  return (
    <MaterialFlatButton {...props} />
  )
}

Button.defaultProps = {
  type: 'button',
  backgroundColor: '#C69C76',
  hoverColor: '#cfab8b',
  labelStyle: {
    color: 'white'
  }
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}
