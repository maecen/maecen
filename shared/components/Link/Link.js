import React, { Component } from 'react'
import { Link as RouterLink } from 'react-router'

const style = {
  link: {
    textDecoration: 'none'
  }
}

export default class Link extends Component {
  render () {
    const newStyle = {...this.props.style, ...style.link}
    let props = Object.assign({}, this.props)
    delete props.style
    return (
      <RouterLink style={newStyle} {...props}>{this.props.children}</RouterLink>
    )
  }
}
