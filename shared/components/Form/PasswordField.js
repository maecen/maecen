import React, { PropTypes } from 'react'
import { get } from 'object-path'

export default function PasswordField (props, context) {
  const path = Array.isArray(props.path) ? props.path.join('.') : props.path
  const error = context.errors[path] || null

  return (
    <div>
      { props.label &&
        <label>{props.label}</label>
      }
      <input type='password'
        value={get(context.model, path) || ''}
        onChange={context.updateValue.bind(null, props.path)}
        placeholder={props.placeholder}
        readOnly={props.readOnly}
        maxLength={props.maxLength} />
      {error &&
        <div style={{color: '#ff0000'}}>{error}</div>
      }
    </div>
  )
}

PasswordField.defaultProps = {
  readOnly: false,
  maxLength: null
}

PasswordField.propTypes = {
  path: React.PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]).isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  readOnly: PropTypes.bool,
  maxLength: PropTypes.string
}

PasswordField.contextTypes = {
  updateValue: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

