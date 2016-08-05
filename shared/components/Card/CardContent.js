import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import Radium from 'radium'
import styleVariables from '../styleVariables'

const style = {
  padding: styleVariables.spacer.base,
  fontSize: styleVariables.font.size.body,
  lineHeight: '1.7',
  '@media (min-width: 70rem)': {
    fontSize: styleVariables.font.size.bodyDesktop
  }
}

function CardText (props) {
  props = Immutable(props)

  let styling = {...props.style, ...style}

  if (props.noTopPadding === true) {
    styling = {
      ...styling,
      paddingTop: '0px'
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
