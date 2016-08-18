import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import Radium from 'radium'
import styleVariables from '../styleVariables'
const flex = {
  base: {
    flex: '0 0 100%',
    maxWidth: '100%'
  },
  half: {
    flex: '0 0 50%',
    maxWidth: '50%'
  },
  third: {
    flex: '0 0 33.3333%',
    maxWidth: '33.3333%'
  },
  quater: {
    flex: '0 0 25%',
    maxWidth: '25%'
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
  },
  lg: {
    base: {
      [styleVariables.breakpoint.lg]: flex.base
    },
    half: {
      [styleVariables.breakpoint.lg]: flex.half
    },
    third: {
      [styleVariables.breakpoint.lg]: flex.third
    },
    quater: {
      [styleVariables.breakpoint.lg]: flex.quater
    }
  },
  md: {
    half: {
      [styleVariables.breakpoint.md]: flex.half
    },
    third: {
      [styleVariables.breakpoint.md]: flex.third
    },
    quater: {
      [styleVariables.breakpoint.md]: flex.quater
    }
  },
  sm: {
    half: {
      [styleVariables.breakpoint.sm]: flex.half
    },
    third: {
      [styleVariables.breakpoint.sm]: flex.third
    },
    quater: {
      [styleVariables.breakpoint.sm]: flex.quater
    }
  }
}

function Cell (props) {
  props = Immutable(props)
  let styling = {...style.base, ...props.style}

  if (props.sm === '1/2') {
    styling = {...styling, ...style.sm.half}
  }
  if (props.sm === '1/3') {
    styling = {...styling, ...style.sm.third}
  }
  if (props.sm === '1/4') {
    styling = {...styling, ...style.sm.quater}
  }
  if (props.md === '1/2') {
    styling = {...styling, ...style.md.half}
  }
  if (props.md === '1/3') {
    styling = {...styling, ...style.md.third}
  }
  if (props.md === '1/4') {
    styling = {...styling, ...style.md.quater}
  }
  if (props.lg === '1') {
    styling = {...styling, ...style.lg.base}
  }
  if (props.lg === '1/2') {
    styling = {...styling, ...style.lg.half}
  }
  if (props.lg === '1/3') {
    styling = {...styling, ...style.lg.third}
  }
  if (props.lg === '1/4') {
    styling = {...styling, ...style.lg.quater}
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
  lg: PropTypes.string,
  md: PropTypes.string,
  sm: PropTypes.string
}

export default Radium(
  Cell
)
