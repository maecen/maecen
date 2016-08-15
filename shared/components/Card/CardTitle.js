import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'

import styleVariables from '../styleVariables'
import { CardTitle as MaterialCardTitle } from 'material-ui/Card'

export default function CardTitle (props) {
  props = Immutable(props)

  let titleStyle = props.titleStyle
  if (props.big === true) {
    titleStyle = {
      ...titleStyle,
      fontSize: styleVariables.font.size.h1Big,
      fontWeight: styleVariables.font.weight.heading,
      padding: 0
    }
  }
  return (
    <MaterialCardTitle
      titleStyle={titleStyle}
      {...props.without('titleStyle', 'big')} />
  )
}

CardTitle.defaultProps = {
  titleStyle: {
    lineHeight: styleVariables.font.lineHeight.heading,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  subtitleStyle: {
    marginTop: styleVariables.spacer.quart
  },
  style: {
    display: 'inline-block',
    overflow: 'hidden',
    maxWidth: '100%'
  },
  big: false
}

CardTitle.propTypes = {
  big: PropTypes.bool
}
