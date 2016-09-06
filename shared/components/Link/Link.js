import React, { Component } from 'react'
import styleVariables from '../../components/styleVariables'
import { Link as RouterLink } from 'react-router'

export default class Link extends Component {
  render () {
    const newStyle = {...style.base, ...this.props.style}
    let props = Object.assign({}, this.props)
    delete props.style
    return (
      <RouterLink style={newStyle} {...props}>{this.props.children}</RouterLink>
    )
  }
}

const style = {
  base: {
    textDecoration: 'none',
    color: styleVariables.color.primary
  }
}
