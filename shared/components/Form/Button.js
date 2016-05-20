import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import MaterialRaisedButton from 'material-ui/RaisedButton'
import MaterialFlatButton from 'material-ui/FlatButton'

export default function Button (props, context) {
  props = Immutable(props)
  const ButtonType = props.flat ? MaterialFlatButton : MaterialRaisedButton
  const LastButton = props.last
  if (LastButton) {
    return (
      <ButtonType {...props.without('flat', 'style')} />
    )
  } else {
    return (
      <ButtonType {...props.without('flat')} />
    )
  }
}

Button.defaultProps = {
  type: 'button',
  flat: false,
  last: false,
  style: {
    marginRight: '.5rem'
  },
  labelStyle: {
    letterSpacing: '0.1rem'
  }
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  flat: PropTypes.bool,
  last: PropTypes.bool
}
