import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import styleVariables from '../styleVariables'

const style = {
  base: {
    margin: `0px -${styleVariables.grid.gutter.half}`,
    display: 'flex',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    width: `calc(100% + ${styleVariables.grid.gutter.base})`
  }
}

function Row (props) {
  props = Immutable(props)
  let styling = {...props.style, ...style.base}

  return (
    <div style={styling}>
      { props.children }
    </div>
  )
}

Row.propTypes = {
  align: PropTypes.string
}

export default Row
