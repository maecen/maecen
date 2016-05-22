import React, { PropTypes, Component } from 'react'
import MaterialDialog from 'material-ui/Dialog'

const customContentStyle = {
  width: '90%',
  maxWidth: '550px'
}

export default class Dialog extends Component {
  render () {
    return (
      <MaterialDialog
        {...this.props}
        contentStyle={customContentStyle}>
        {this.props.onClick
          ? <div onClick={this.props.onClick}>{this.props.children}</div>
          : this.props.children
        }
      </MaterialDialog>
    )
  }
}

Dialog.propTypes = {
  onClick: PropTypes.func
}

Dialog.defaultProps = {
  titleStyle: {
    paddingBottom: '0'
  }
}
