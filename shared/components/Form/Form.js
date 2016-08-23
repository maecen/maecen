import React, { PropTypes, Component } from 'react'
import styleVariables from '../styleVariables'

export default class Form extends Component {

  // If e is an event with a value property use that, otherwise use e as the
  // value
  updateValue (path, e) {
    const value = e.target && typeof e.target.value !== 'undefined'
      ? e.target.value
      : e
    this.props.updateModel(path, value)
  }

  getChildContext () {
    return {
      updateValue: this.updateValue.bind(this),
      model: this.props.model,
      errors: this.props.errors || {}
    }
  }

  render () {
    const { errors } = this.props
    const error = errors && errors['_'] || null

    return (
      <form onSubmit={this.props.onSubmit}>
        {error &&
          <div style={style.error}>{error}</div>
        }
        {this.props.children}
      </form>
    )
  }
}

const style = {
  error: {
    color: styleVariables.color.alert,
    padding: `0px ${styleVariables.spacer.base}`
  }
}
Form.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  updateModel: PropTypes.func.isRequired,
  errors: PropTypes.object
}

Form.childContextTypes = {
  model: PropTypes.object,
  updateValue: PropTypes.func,
  errors: PropTypes.object
}
