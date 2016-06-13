import React, { Component } from 'react'
import { CardHeader as MaterialCardHeader } from 'material-ui/Card'

export default class CardHeader extends Component {
  render () {
    return (
      <MaterialCardHeader {...this.props} />
    )
  }
}

CardHeader.defaultProps = {
  style: {
    lineHeight: '1.6',
    wordBreak: 'break-word',
    paddingBottom: '0px'
  }
}
