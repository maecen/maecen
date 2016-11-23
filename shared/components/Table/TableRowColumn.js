import React from 'react'
import { TableRowColumn as MaterialRowCol } from 'material-ui/Table'

import styleVariables from '../styleVariables'

const spacer = styleVariables.spacer
const TableRowColumn = ({ style, ...props }) => {
  const elStyle = {
    paddingLeft: spacer.half,
    paddingRight: spacer.half,
    ...style
  }

  return (
    <MaterialRowCol style={elStyle} {...props}>
      { props.children }
    </MaterialRowCol>
  )
}

export default TableRowColumn
