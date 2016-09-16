// Imports
import React, { Component, PropTypes } from 'react'

export default class Portal extends Component {
  componentDidMount () {
    const { portalId } = this.props
    let p = portalId && document.getElementById(portalId)
    if (!p) {
      p = document.createElement('div')
      p.id = portalId
      document.body.appendChild(p)
    }
    this.portalElement = p
    this.componentDidUpdate()
  }

  componentWillUnmount () {
    document.body.removeChild(this.portalElement)
  }

  componentDidUpdate () {
    React.render(<div {...this.props}>{this.props.children}</div>, this.portalElement)
  }

  render () {
    return null
  }
}

Portal.proptypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  portalId: PropTypes.string
}
