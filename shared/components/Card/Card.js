import React, { PropTypes, Component } from 'react'
import UICard from 'material-ui/Card'

export default class Card extends Component {
  render () {
    return (
      <UICard>
        {this.props.onClick
          ? <div onClick={this.props.onClick}>{this.props.children}</div>
          : this.props.children
        }
      </UICard>
    )
  }
}

Card.propTypes = {
  children: PropTypes.object.isRequired,
  onClick: PropTypes.func
}
