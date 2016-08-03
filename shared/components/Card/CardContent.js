import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import Radium from 'radium'

function CardText (props) {
  props = Immutable(props)

  let styling = {...props.style, ...style}

  if (props.noTopPadding === true) {
    styling = {
      ...style,
      paddingTop: '0px'
    }
  }
  return (
    <div style={styling}>
      { props.children }
    </div>
  )
}

const style = {
  padding: '16px',
  fontSize: '16px',
  lineHeight: '1.7',
  wordBreak: 'break-word',
  whiteSpace: 'pre-line',
  '@media (min-width: 992px)': {
    fontSize: '18px'
  }
}

CardText.propTypes = {
  noTopPadding: PropTypes.bool
}

export default Radium(
  CardText
)
