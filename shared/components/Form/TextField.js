import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import { get } from 'object-path'
import MaterialTextField from 'material-ui/TextField'

export default function TextField (props, context) {
  props = Immutable(props)
  const path = Array.isArray(props.path) ? props.path.join('.') : props.path
  const error = context.errors[path] || null

  return (
    <MaterialTextField
      floatingLabelText={props.label}
      hintText={props.placeholder}
      value={get(context.model, path) || ''}
      onChange={context.updateValue.bind(null, props.path)}
      errorText={error}
      {...props.without('placeholder', 'label', 'path')} />
  )
}

TextField.defaultProps = {
  readOnly: false,
  maxLength: null,
  type: 'text',
  fullWidth: true
}

TextField.propTypes = {
  path: React.PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]).isRequired,
  placeholder: PropTypes.string
}

TextField.contextTypes = {
  updateValue: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}
