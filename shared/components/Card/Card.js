import React, { PropTypes, Component } from 'react'
import MaterialCard from 'material-ui/Card'
import styleVariables from '../styleVariables'

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
    marginBottom: styleVariables.spacer.base,
    boxShadow: 'none',
    // relative because absolute positioned edit buttons
    position: 'relative'
  }
}

Card.propTypes = {
  onClick: PropTypes.func
}
