import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import Radium from 'radium'

import styleVariables from '../styleVariables'
import { CardTitle as MaterialCardTitle } from 'material-ui/Card'

function CardTitle (props) {
  props = Immutable(props)

  let titleStyle = props.titleStyle
  if (props.big === true) {
    titleStyle = {
      ...titleStyle, ...style.big
    }
  }
  if (props.oneLine === true) {
    titleStyle = {
      ...titleStyle, ...style.oneLine
    }
  }
  return (
    <MaterialCardTitle
      titleStyle={titleStyle}
      {...props.without('titleStyle', 'big', 'oneLine')} />
  )
}

CardTitle.defaultProps = {
  titleStyle: {
    fontSize: styleVariables.font.size.h1,
    fontWeight: styleVariables.font.weight.heading,
    lineHeight: styleVariables.font.lineHeight.heading
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

const style = {
  big: {
    fontWeight: styleVariables.font.weight.heading,
    padding: 0,
    fontSize: styleVariables.font.size.h1Big
  },
  oneLine: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }
}

export default Radium(
  CardTitle
)
