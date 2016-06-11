import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import { CardTitle as MaterialCardTitle } from 'material-ui/Card'

export default function CardTitle (props) {
  props = Immutable(props)

  let titleStyle = props.titleStyle
  if (props.big === true) {
    titleStyle = {
      ...titleStyle,
      fontSize: '40px',
      fontWeight: '300',
      paddingTop: '16px',
      paddingBottom: '16px'
    }
  }
  return (
    <MaterialCardTitle
      titleStyle={titleStyle}
      {...props.without('titleStyle')} />
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
