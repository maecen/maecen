import React, { Component } from 'react'
import CardText from './CardContent'

export default class CardError extends Component {
  render () {
    return (
      <CardText {...this.props} />
    )
  }
}

CardError.defaultProps = {
  style: {
    lineHeight: '1.6',
    color: 'red'
  }
}
