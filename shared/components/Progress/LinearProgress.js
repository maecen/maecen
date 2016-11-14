import React from 'react'
import LinearProgress from 'material-ui/LinearProgress'
import styleVariables from '../styleVariables'

export default function LinearProgressDeterminate ({
  style,
  ...props
}) {
  const progress = props.value
  const rootStyle = progress === 100 || progress === 0
    ? elStyle.done
    : elStyle.move

  return (
    <LinearProgress
      mode='determinate'
      style={{...style, ...elStyle.base, ...rootStyle}}
      {...props}
    />
  )
}

const elStyle = {
  base: {
    background: styleVariables.color.background,
    borderRadius: styleVariables.border.radius,
    transition: styleVariables.animation.default
  },
  done: {
    opacity: '0',
    visibility: 'hidden'
  },
  move: {
    opacity: '1',
    visibility: 'visible'
  }
}
