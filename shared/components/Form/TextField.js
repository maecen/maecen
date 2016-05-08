import React, { PropTypes } from 'react'
import { get } from 'object-path'

export default function TextField (props, context) {
  const path = Array.isArray(props.path) ? props.path.join('.') : props.path
  const error = context.errors[path] || null

  const TextInput = props.multiline ? 'textarea' : 'input'

  return (
    <div>
      { props.label &&
        <label>{props.label}</label>
      }
      <TextInput type='text'
        value={get(context.model, path) || ''}
        onChange={context.updateValue.bind(null, props.path)}
        placeholder={props.placeholder}
        readOnly={props.readOnly}
        maxLength={props.maxLength}
        rows={props.rows} />
      {error &&
        <div style={{color: '#ff0000'}}>{error}</div>
      }
    </div>
  )
}

TextField.defaultProps = {
  readOnly: false,
  maxLength: null,
  multiline: false
}

TextField.propTypes = {
  path: React.PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]).isRequired,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  rows: PropTypes.string,
  readOnly: PropTypes.bool,
  maxLength: PropTypes.string,
  multiline: PropTypes.bool
}

TextField.contextTypes = {
  updateValue: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}
