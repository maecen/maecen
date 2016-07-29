import React, { PropTypes, Component } from 'react'
import MaterialCard from 'material-ui/Card'

export default class Card extends Component {
  render () {
    return (
      <MaterialCard {...this.props}>
        {this.props.onClick
          ? <div onClick={this.props.onClick}>{this.props.children}</div>
          : this.props.children
        }
      </MaterialCard>
    )
  }
}

Card.defaultProps = {
  style: {
    marginBottom: '4px',
    position: 'relative'
  }
}

Card.propTypes = {
  onClick: PropTypes.func
}
