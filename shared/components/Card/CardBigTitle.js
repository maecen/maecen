import React from 'react'
import Immutable from 'seamless-immutable'
import Radium from 'radium'
import styleVariables from '../styleVariables'

const style = {
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  lineHeight: styleVariables.font.lineHeight.heading,
  fontSize: styleVariables.font.size.h1,
  fontWeight: styleVariables.font.weight.body,
  margin: '0px',
  padding: '0px',
  [styleVariables.breakpoint.md]: {
    fontSize: styleVariables.font.size.h1Big,
    fontWeight: styleVariables.font.weight.heading
  }
}

function CardBigTitle (props) {
  props = Immutable(props)

  let styling = {...style, ...props.style}

  return (
    <h2 style={styling}>
      { props.children }
    </h2>
  )
}

export default Radium(
  CardBigTitle
)
