import { startsWith } from 'strman'
import React, { Component, PropTypes } from 'react'

class ImageField extends Component {

  constructor (props) {
    super(props)
    this.state = {file: '', imagePreviewUrl: ''}
  }

  handleChange (e) {
    e.preventDefault()

    const { updateValue } = this.context
    const { path } = this.props
    const reader = new FileReader()
    const file = e.target.files[0]

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      })
      updateValue(path, reader.result)
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

    const { imagePreviewUrl } = this.state

    return (
      <div>
        { props.label &&
          <label>{props.label}</label>
        }
        <input type='file'
          onChange={this.handleChange.bind(this)} />
        {renderImagePreview(imagePreviewUrl)}
        {error &&
          <div style={{color: '#ff0000'}}>{error}</div>
        }
      </div>
    )
  }
}

function renderImagePreview (imagePreviewUrl) {
  if (imagePreviewUrl && startsWith(imagePreviewUrl, 'data:image') === true) {
    return (
      <img src={imagePreviewUrl}
        style={{maxWidth: '50px', maxHeight: '50px'}}/>
    )
  }
}

ImageField.propTypes = {
  path: React.PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]).isRequired,
  label: PropTypes.string
}

ImageField.contextTypes = {
  updateValue: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

export default ImageField
