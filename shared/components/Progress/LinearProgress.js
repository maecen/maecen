import React, { Component } from 'react'
import LinearProgress from 'material-ui/LinearProgress'
import styleVariables from '../styleVariables'

const style = {
  done: {
    opacity: '0',
    visibility: 'hidden'
  },
  inProgress: {
    opacity: '1',
    visibility: 'visible'
  }
}
export default class LinearProgressDeterminate extends Component {
  render () {
    return (
      <LinearProgress
        mode='determinate' {...this.props}
        style={ this.props.value === 100 ? style.done : style.inProgress }
      />
    )
  }
}

LinearProgressDeterminate.defaultProps = {
  style: {
    backgroundColor: 'transparent',
    borderRadius: styleVariables.border.radius,
    transition: styleVariables.animation.default
  }
}
