import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import styleVariables from '../styleVariables'

const style = {
  margin: `0px -${styleVariables.grid.gutter.half}`,
  display: 'flex',
  flexWrap: 'wrap'
}

function Row (props) {
  props = Immutable(props)
  let styling = {...style, ...props.style}

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
