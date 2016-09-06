import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import { get } from 'object-path'
import MaterialTextField from 'material-ui/TextField'

export default function TextField (props, context) {
  props = Immutable(props)
  if (props.path) {
    const path = Array.isArray(props.path) ? props.path.join('.') : props.path
    let error = context.errors[path] || null
    if (error && error.message) {
      error = error.message
    }

    return (
      <MaterialTextField
        floatingLabelText={props.label}
        hintText={props.placeholder}
        value={get(context.model, path) || ''}
        onChange={context.updateValue.bind(null, props.path)}
        errorText={error || props.error}
        {...props.without('placeholder', 'label', 'path', 'error')}
      />
    )
  } else {
    return (
      <MaterialTextField
        floatingLabelText={props.label}
        hintText={props.placeholder}
        errorText={props.error}
        {...props.without('placeholder', 'label', 'path', 'error')}
      />
    )
  }
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
  ]),
  placeholder: PropTypes.string
}

TextField.contextTypes = {
  updateValue: PropTypes.func,
  model: PropTypes.object,
  errors: PropTypes.object
}
