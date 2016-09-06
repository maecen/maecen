import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import Radium from 'radium'
import styleVariables from '../styleVariables'

const flex = {
  base: {
    flex: '0 0 100%',
    maxWidth: '100%'
  }
}

const style = {
  base: {
    padding: `0px ${styleVariables.grid.gutter.half}`,
    ...flex.base,
    boxSizing: 'border-box'
  },
  narrow: {
    flex: '0 0 auto',
    margin: '0 auto',
    width: styleVariables.media.md
  },
  narrower: {
    flex: '0 0 auto',
    margin: '0 auto',
    width: styleVariables.media.sm
  }
}

function Cell (props) {
  props = Immutable(props)
  let styling = {...style.base, ...props.style}

  const breakpoints = ['sm', 'md', 'lg']

  for (let breakpoint of breakpoints) {
    const prop = props[breakpoint]
    if (prop) {
      const pct = (prop / 12) * 100
      styling = {
        ...styling,
        [styleVariables.breakpoint[breakpoint]]: {
          flex: `0 0 ${pct}%`,
          maxWidth: `${pct}%`
        }
      }
    }
  }

  if (props.narrowLayout === true) {
    styling = {...styling, ...style.narrow}
  }
  if (props.narrowerLayout === true) {
    styling = {...styling, ...style.narrower}
  }

  return (
    <div style={styling}>
      { props.children }
    </div>
  )
}

Cell.propTypes = {
  lg: PropTypes.number,
  md: PropTypes.number,
  sm: PropTypes.number
}

export default Radium(
  Cell
)
