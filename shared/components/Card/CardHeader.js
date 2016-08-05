import React, { Component } from 'react'
import { CardHeader as MaterialCardHeader } from 'material-ui/Card'
import styleVariables from '../styleVariables'

export default class CardHeader extends Component {
  render () {
    return (
      <MaterialCardHeader {...this.props} />
    )
  }
}

CardHeader.defaultProps = {
  style: {
    lineHeight: styleVariables.layout.lineHeight,
    wordBreak: 'break-word',
    paddingBottom: '0px'
  }
}
