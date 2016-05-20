import React, { PropTypes, Component } from 'react'
import UICardHeader from 'material-ui/CardHeader'

export default class CardHeader extends Component {

  render () {
    return (
      <UICardHeader>
        {this.props.children}
      </UICardHeader>
    )
  }
}

CardHeader.propTypes = {
  children: PropTypes.object.isRequired
}
