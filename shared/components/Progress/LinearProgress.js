import React, { Component } from 'react'
import LinearProgress from 'material-ui/LinearProgress'
import styleVariables from '../styleVariables'

const style = {
  done: {
    opacity: '0',
    visibility: 'hidden'
  },
  move: {
    opacity: '1',
    visibility: 'visible'
  }
}
export default class LinearProgressDeterminate extends Component {
  render () {
    const progress = this.props.value
    return (
      <LinearProgress
        mode='determinate' {...this.props}
        style={ progress === 100 || progress === 0 ? style.done : style.move }
      />
    )
  }
}

LinearProgressDeterminate.defaultProps = {
  style: {
    backgroundColor: 'none',
    borderRadius: styleVariables.border.radius,
    transition: styleVariables.animation.default
  }
}
