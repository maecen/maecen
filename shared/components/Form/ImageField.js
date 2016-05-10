import React, { Component, PropTypes } from 'react'

class ImageField extends Component {

  constructor (props) {
    super(props)
    this.state = {file: '', imagePreviewUrl: ''}
  }

  handleChange (e) {
    e.preventDefault()

    const { updateValue } = this.context
    const { dataUriPath } = this.props
    const reader = new FileReader()
    const file = e.target.files[0]

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      })
      updateValue(dataUriPath, reader.result)
    }

    reader.readAsDataURL(file)
  }

  render () {
    const { props, context } = this
    const path = Array.isArray(props.path) ? props.path.join('.') : props.path
    const error = context.errors[path] || null

    const {imagePreviewUrl} = this.state
    let $imagePreview = null
    if (imagePreviewUrl) {
      $imagePreview = (
        <img src={imagePreviewUrl}
          style={{maxWidth: '50px', maxHeight: '50px'}}/>
      )
    } else {
      $imagePreview = (
        <div className='previewText'>Please select an Image for Preview</div>
      )
    }

    return (
      <div>
        { props.label &&
          <label>{props.label}</label>
        }
        <input type='file'
          onChange={this.handleChange.bind(this)} />
        {$imagePreview}
        {error &&
          <div style={{color: '#ff0000'}}>{error}</div>
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
  dataUriPath: React.PropTypes.oneOfType([
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
