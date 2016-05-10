import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'

export default function Button (props, context) {
  props = Immutable(props)

  return (
    <button {...props.without('label')}>{props.label}</button>
  )
}

Button.defaultProps = {
  type: 'button'
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}
