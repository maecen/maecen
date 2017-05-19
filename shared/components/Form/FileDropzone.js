import React, { Component, PropTypes } from 'react'
import Button from './Button'
import styleVariables from '../styleVariables'

import { isBrowser } from '../../config'

class FileDropzone extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDragActive: false,
      message: '',
      src: null
    }
    this.onClick = this.onClick.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)

    if(isBrowser) {
      this.reader = new window.FileReader()
      this.reader.onloadend = this.updateSrc.bind(this)
    }
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
      this.setState({ message: '', src: null })
    } else if (files.length === 1) {
      this.checkForAndGenerateThumbnail(files[0])
      this.setState({ message: files[0].name })
    } else if (files.length > 1) {
      this.setState({ message: `${files.length} files picked`, src: null })
    }

    if (this.props.onChange) {
      this.props.onChange(files)
    }

    // each(files, this._createPreview)
  }

  onClick () {
    this.refs.fileInput.click()
  }

  checkForAndGenerateThumbnail(file) {
    if(this.reader && file.type.match('image.*')) {
      this.reader.readAsDataURL(file)
    }
  }

  updateSrc() {
    this.setState({src: this.reader.result})
  }

  render () {
    const label = this.props.label || 'Upload File'
    const { error } = this.props
    const { src } = this.state

    const style = {
      dropZone: {
        cursor: 'pointer',
        display: 'inline-block',
        marginBottom: styleVariables.spacer.half,
        marginTop: styleVariables.spacer.base,
        width: this.props.width
      },
      error: {
        color: styleVariables.color.alert,
        fontSize: styleVariables.font.size.bodySmall,
        marginTop: styleVariables.spacer.half
      },
      input: {
        display: 'none'
      },
      buttonWrapper: {
        overflow: 'hidden',
        position: 'relative',
        padding: '1px 0 1px'
      },
      image: {
        width: '100%',
        height: 'auto',
        position: 'absolute'
      },
      button: {
        border: '1px solid #e0e0e0',
        borderRadius: '3px',
        height: this.props.height,
        width: '100%',
        marginTop: '-1px'
      }
    }
    return (
      <div
        style={style.dropZone}
        onClick={this.onClick}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
      >

        <input style={style.input}
          type='file'
          multiple={this.props.multiple}
          accept={this.props.accept}
          ref='fileInput'
          onChange={this.onDrop}
        />
        { this.props.children ||
          <div style={style.buttonWrapper}>
            { src &&
              <img src={src} style={ style.image } alt='Preview'/>
            }
            <Button label={src ? ' ' : label} flat={true} style={style.button} />
          </div>
        }

        {error
          ? <div style={style.error}>
              {error}
            </div>
          : <span>
              {!src && this.state.message}
            </span>
        }
      </div>
    )
  }
}

FileDropzone.defaultProps = {
  multiple: true,
  height: '40px',
  width: 'auto'
}

FileDropzone.propTypes = {
  multiple: PropTypes.bool,
  label: PropTypes.string,
  error: PropTypes.string,
  accept: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.node,
  height: PropTypes.string,
  width: PropTypes.string
}

export default FileDropzone
