import React, { PropTypes } from 'react'
import Immutable from 'seamless-immutable'
import { CardTitle as MaterialCardTitle } from 'material-ui/Card'

export default function CardTitle (props) {
  props = Immutable(props)
  const bigTitle = props.big
  if (bigTitle) {
    return (
      <MaterialCardTitle {...props} />
    )
  } else {
    return (
      <MaterialCardTitle {...props.without('titleStyle')} />
    )
  }
}

CardTitle.defaultProps = {
  titleStyle: {
    fontSize: '40px',
    fontWeight: '700'
  }
}

CardTitle.propTypes = {
  big: PropTypes.bool
}
