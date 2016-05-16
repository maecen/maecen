import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import MaterialRaisedButton from 'material-ui/RaisedButton'

export default function Button (props, context) {
  props = Immutable(props)

  return (
    <MaterialRaisedButton {...props} />
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
