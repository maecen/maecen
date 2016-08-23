import React, { Component } from 'react'
import { TableRowColumn as MaterialRowCol } from 'material-ui/Table'

import styleVariables from '../styleVariables'

export default class TableRowColumn extends Component {
  render () {
    return (
      <MaterialRowCol {...this.props}>
        { this.props.children }
      </MaterialRowCol>
    )
  }
}

const spacer = styleVariables.spacer

TableRowColumn.defaultProps = {
  style: {
    paddingLeft: spacer.half,
    paddingRight: spacer.half
  }
}
