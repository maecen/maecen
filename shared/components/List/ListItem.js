import React from 'react'
import { ListItem as MaterialListItem } from 'material-ui/List'
// import styleVariables from '../styleVariables'

export default function ListItem (props) {
  return (
    <MaterialListItem {...props} />
  )
}

ListItem.defaultProps = {
  style: {
    WebkitAppearance: 'none'
  }
}
