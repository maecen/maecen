import React, { Component } from 'react'
import LinearProgress from 'material-ui/LinearProgress'
import s from './Progress.scss'

export default class LinearProgressDeterminate extends Component {
  render () {
    return (
      <LinearProgress
        mode='determinate' {...this.props}
        className={ this.props.value === 100 ? s.done : s.inProgress }
      />
    )
  }
}

LinearProgressDeterminate.defaultProps = {
  style: {
    backgroundColor: 'transparent',
    borderRadius: '3px',
    transition: '.3s ease'
  }
}
