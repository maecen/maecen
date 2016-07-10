import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import MaterialRaisedButton from 'material-ui/RaisedButton'
import MaterialFlatButton from 'material-ui/FlatButton'

export default function Button (props, context) {
  props = Immutable(props)
  const ButtonType = props.flat ? MaterialFlatButton : MaterialRaisedButton
  if (!props.last) {
    props = props.setIn(['style', 'marginRight'], '0.5rem')
    return <ButtonType {...props.without('flat')} />
  } else {
    return <ButtonType {...props.without('flat')} />
  }
}

Button.defaultProps = {
  type: 'button',
  flat: false,
  last: false,
  style: {
    backgroundColor: 'transparent',
    height: 'auto'
  },
  labelStyle: {
    height: 'auto',
    letterSpacing: '0.1rem',
    lineHeight: '20px',
    display: 'block',
    padding: '8px 0',
    margin: '0 12px',
    color: 'black'
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
