import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import { CardText as MaterialCardText } from 'material-ui/Card'

export default function CardText (props) {
  props = Immutable(props)

  let style = props.style
  if (props.noTopPadding === true) {
    style = {
      ...style,
      paddingTop: '0px'
    }
  }
  return (
    <MaterialCardText
      style={style}
      {...props.without('style')} />
  )
}

// TODO 16px på mobil og 18px på desktop
CardText.defaultProps = {
  style: {
    lineHeight: '1.7',
    wordBreak: 'break-word',
    whiteSpace: 'pre-line',
    fontSize: '16px'
  }
}

CardText.propTypes = {
  noTopPadding: PropTypes.bool
}
