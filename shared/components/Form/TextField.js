import React, { PropTypes } from 'react'
import { get } from 'object-path'
import MaterialTextField from 'material-ui/TextField'

export default function TextField (props, context) {
  const path = Array.isArray(props.path) ? props.path.join('.') : props.path
  const error = context.errors[path] || null

  return (
    <MaterialTextField
      floatingLabelText={props.label}
      hintText={props.placeholder}
      value={get(context.model, path) || ''}
      onChange={context.updateValue.bind(null, props.path)}
      errorText={error}
      type={props.type}
      {...props} />
  )
}

TextField.defaultProps = {
  readOnly: false,
  maxLength: null,
  type: 'text'
}

TextField.propTypes = {
  path: React.PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]).isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  rows: PropTypes.string,
  maxLength: PropTypes.string,
  multiLine: PropTypes.bool,
  type: PropTypes.string
}

TextField.contextTypes = {
  updateValue: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}
