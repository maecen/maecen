import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import Radium from 'radium'
import styleVariables from '../styleVariables'
const flex = {
  base: {
    flex: '0 0 100%'
  },
  half: {
    flex: '0 0 50%'
  }
}
const style = {
  base: {
    padding: `0px ${styleVariables.grid.gutter.half}`,
    ...flex.base,
    boxSizing: 'border-box',
    maxWidth: '100%'
  },
  lgHalf: {
    [styleVariables.breakpoint.lg]: flex.half
  },
  mdHalf: {
    [styleVariables.breakpoint.md]: flex.half
  }
}

function Cell (props) {
  props = Immutable(props)
  let styling = {...style.base, ...props.style}

  if (props.lg === '1/2') {
    styling = {...styling, ...style.lgHalf}
  }
  if (props.md === '1/2') {
    styling = {...styling, ...style.mdHalf}
  }

  return (
    <div style={styling}>
      { props.children }
    </div>
  )
}

Cell.propTypes = {
  lg: PropTypes.string
}

export default Radium(
  Cell
)
