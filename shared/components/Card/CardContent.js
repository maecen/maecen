import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import Radium from 'radium'
import styleVariables from '../styleVariables'

const style = {
  padding: styleVariables.spacer.base,
  fontSize: styleVariables.font.size.body,
  lineHeight: styleVariables.font.lineHeight.body,
  [styleVariables.breakpoint.md]: {
    fontSize: styleVariables.font.size.bodyLarge
  }
}

function CardText (props) {
  props = Immutable(props)

  let styling = {...style, ...props.style}

  if (props.noTopPadding === true) {
    delete styling.padding
    styling = {
      ...styling,
      paddingTop: '0px',
      paddingRight: styleVariables.spacer.base,
      paddingBottom: styleVariables.spacer.base,
      paddingLeft: styleVariables.spacer.base
    }
  }
  return (
    <div style={styling}>
      { props.children }
    </div>
  )
}

CardText.propTypes = {
  noTopPadding: PropTypes.bool
}

export default Radium(
  CardText
)
