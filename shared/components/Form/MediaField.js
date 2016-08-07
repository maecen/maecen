import React, { Component, PropTypes } from 'react'
import styleVariables from '../styleVariables'

class ImageField extends Component {

  constructor (props) {
    super(props)
    this.state = {file: ''}
  }

  handleChange (e) {
    e.preventDefault()

    const { updateValue } = this.context
    const { path, previewChange } = this.props
    const reader = new FileReader()
    const file = e.target.files[0]

    reader.onloadend = () => {
      this.setState({
        file: file
      })

      updateValue(path, reader.result)

      if (previewChange) {
        previewChange(reader.result)
      }
    }

    reader.readAsDataURL(file)
  }

  render () {
    const { props, context } = this
    const path = Array.isArray(props.path) ? props.path.join('.') : props.path
    let error = context.errors[path] || null
    if (error && error.message) {
      error = error.message
    }

    const style = {
      main: {
        marginTop: styleVariables.spacer.base
      },
      error: {
        color: styleVariables.color.alert
      }
    }

    return (
      <div style={style.main}>
        { props.label &&
          <label>{props.label} </label>
        }
        <input type='file'
          multiple
          onChange={this.handleChange.bind(this)} />
        {error &&
          <div style={style.error}>{error}</div>
        }
      </div>
    )
  }
}

ImageField.propTypes = {
  path: React.PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]).isRequired,
  label: PropTypes.string,
  previewChange: PropTypes.func
}

ImageField.contextTypes = {
  updateValue: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

export default ImageField
