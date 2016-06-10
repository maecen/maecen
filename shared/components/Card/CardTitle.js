import React, { PropTypes } from 'react'
import { CardTitle as MaterialCardTitle } from 'material-ui/Card'

export default function CardTitle (props) {
  if (props.big === true) {
    props.titleStyle.fontSize = '40px'
    props.titleStyle.fontWeight = '300'
    props.titleStyle.paddingTop = '16px'
    props.titleStyle.paddingBottom = '16px'
  }
  return (
    <MaterialCardTitle {...props} />
  )
}

CardTitle.defaultProps = {
  titleStyle: {
    lineHeight: '1.2'
  },
  subtitleStyle: {
    marginTop: '4px'
  },
  big: false
}

CardTitle.propTypes = {
  big: PropTypes.bool
}
