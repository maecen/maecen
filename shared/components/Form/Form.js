import React, { PropTypes, Component } from 'react'

export default class Form extends Component {

  // If e is an event with a value property use that, otherwise use e as the
  // value
  updateValue (path, e) {
    const value = e.target && e.target.value
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
    return (
      <form onSubmit={this.props.onSubmit}>
        {this.props.children}
      </form>
    )
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

