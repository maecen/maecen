import React, { PropTypes } from 'react'
import { get } from 'object-path'

export default function SelectField (props, context) {
  const path = Array.isArray(props.path) ? props.path.join('.') : props.path
  const error = context.errors[path] || null

  return (
    <div>
      { props.label &&
        <label>{props.label}</label>
      }
      <select type='text'
        value={get(context.model, path) || ''}
        onChange={context.updateValue.bind(null, props.path)}
        readOnly={props.readOnly}
      >
        {props.children}
      </select>
      {error &&
        <div style={{color: '#ff0000'}}>{error}</div>
      }
    </div>
  )
}

SelectField.defaultProps = {
  readOnly: false,
  maxLength: null
}

SelectField.propTypes = {
  children: PropTypes.node,
  path: React.PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]).isRequired,
  label: PropTypes.string,
  readOnly: PropTypes.bool
}

SelectField.contextTypes = {
  updateValue: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}
