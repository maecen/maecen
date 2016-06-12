import React, { Component } from 'react'
import { CardText as MaterialCardText } from 'material-ui/Card'

export default class CardText extends Component {
  render () {
    return (
      <MaterialCardText {...this.props} />
    )
  }
}

CardText.defaultProps = {
  style: {
    lineHeight: '1.6',
    wordBreak: 'break-word'
  }
}
