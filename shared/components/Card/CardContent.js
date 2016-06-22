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

CardText.defaultProps = {
  style: {
    lineHeight: '1.6',
    wordBreak: 'break-word',
    whiteSpace: 'pre-line'
  }
}

CardText.propTypes = {
  noTopPadding: PropTypes.bool
}
