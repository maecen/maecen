import React, { Component, PropTypes } from 'react'
import s from './MediaField.scss'

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

    return (
      <div className={s.main}>
        { props.label &&
          <label>{props.label} </label>
        }
        <input type='file'
          onChange={this.handleChange.bind(this)} />
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
  label: PropTypes.string,
  previewChange: PropTypes.func
}

ImageField.contextTypes = {
  updateValue: PropTypes.func.isRequired,
  model: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

export default ImageField
