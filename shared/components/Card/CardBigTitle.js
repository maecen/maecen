import React from 'react'
import Immutable from 'seamless-immutable'
import Radium from 'radium'
import styleVariables from '../styleVariables'

const style = {
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  textAlign: 'center',
  overflow: 'hidden',
  lineHeight: styleVariables.font.lineHeight.heading,
  fontSize: styleVariables.font.size.h1,
  fontWeight: styleVariables.font.weight.body,
  padding: `${styleVariables.spacer.double} 0 ${styleVariables.spacer.base}`,
  margin: styleVariables.spacer.base,
  borderBottom: `${styleVariables.border.thickness} solid ${styleVariables.color.background}`,
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
