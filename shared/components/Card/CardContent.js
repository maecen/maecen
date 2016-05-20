import React, { PropTypes } from 'react'
import { CardText as MaterialCardText } from 'material-ui/Card'

export default function CardContent (props) {
  return (
    <MaterialCardText>
      {props.children}
    </MaterialCardText>
  )
}

CardContent.propTypes = {
  children: PropTypes.object.isRequired
}

