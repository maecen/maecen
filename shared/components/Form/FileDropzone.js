import React, { Component, PropTypes } from 'react'
import Button from './Button'
import s from './FileDropzone.scss'

class FileDropzone extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isDragActive: false,
      message: 'No file chosen'
    }
    this.onClick = this.onClick.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
  }

  onDragLeave (e) {
    this.setState({
      isDragActive: false
    })
  }

  onDragOver (e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'

    this.setState({
      isDragActive: true
    })
  }

  onDrop (e) {
    e.preventDefault()

    this.setState({
      isDragActive: false
    })

    let files
    if (e.dataTransfer) {
      files = e.dataTransfer.files
    } else if (e.target) {
      files = e.target.files
    }

    if (files.length === 0) {
      this.setState({ message: 'No file chosen' })
    } else if (files.length === 1) {
      this.setState({ message: files[0].name })
    } else if (files.length > 1) {
      this.setState({ message: `${files.length} files picked` })
    }

    if (this.props.onChange) {
      this.props.onChange(files)
    }

    // each(files, this._createPreview)
  }

  onClick () {
    this.refs.fileInput.click()
  }

  render () {
    const label = this.props.label || 'Upload File'
    return (
      <div
        className={s.main}
        onClick={this.onClick}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
      >
        <input style={{ display: 'none' }}
          type='file'
          multiple={this.props.multiple}
          accept={this.props.accept}
          ref='fileInput'
          onChange={this.onDrop}
        />
        {this.props.children
          ? this.props.children
          : <div>
              <Button label={label} flat='true' style={{border: '1px solid #e0e0e0', borderRadius: '3px', height: '40px', marginTop: '-1px'}} />
              <span className={s.filename}>
                {this.state.message}
              </span>
            </div>
        }
      </div>
    )
  }
}

FileDropzone.defaultProps = {
  multiple: true
}

FileDropzone.propTypes = {
  multiple: PropTypes.bool,
  label: PropTypes.string,
  accept: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.node
}

export default FileDropzone
