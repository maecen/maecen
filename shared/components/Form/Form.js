import React, { PropTypes, Component } from 'react'

export default class Form extends Component {

  updateValue (path, e) {
    const value = e.target.value
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

