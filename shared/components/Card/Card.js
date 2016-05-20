import React, { PropTypes, Component } from 'react'
import MaterialCard from 'material-ui/Card'

export default class Card extends Component {
  render () {
    return (
      <MaterialCard>
        {this.props.onClick
          ? <div onClick={this.props.onClick}>{this.props.children}</div>
          : this.props.children
        }
      </MaterialCard>
    )
  }
}

Card.propTypes = {
  children: PropTypes.object.isRequired,
  onClick: PropTypes.func
}
