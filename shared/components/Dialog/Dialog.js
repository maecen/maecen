import React, { PropTypes, Component } from 'react'
import MaterialDialog from 'material-ui/Dialog'
import styleVariables from '../styleVariables'

export default class Dialog extends Component {
  render () {
    return (
      <MaterialDialog
        {...this.props}>
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
  autoDetectWindowHeight: false,
  style: {
    overflowY: 'auto'
  },
  contentStyle: {
    marginBottom: styleVariables.spacer.double,
    maxWidth: styleVariables.media.xs,
    width: '90%'
  },
  titleStyle: {
    paddingBottom: '0px'
  }
}
