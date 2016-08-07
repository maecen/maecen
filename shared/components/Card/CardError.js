import React, { Component } from 'react'
import CardText from './CardContent'
import styleVariables from '../styleVariables'

export default class CardError extends Component {
  render () {
    return (
      <CardText {...this.props} />
    )
  }
}

CardError.defaultProps = {
  style: {
    lineHeight: styleVariables.font.lineHeight.body,
    color: styleVariables.color.alert
  }
}
