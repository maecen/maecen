// Imports
import React, { PropTypes, Component } from 'react'
import MaterialDialog from 'material-ui/Dialog'

import styleVariables from '../styleVariables'

// Components
import IconButton from 'material-ui/IconButton'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

export default class Dialog extends Component {
  render () {
    return (
      <MaterialDialog
        {...this.props}
      >
        {this.props.modal !== true &&
          <IconButton iconStyle={style.closeIcon} style={style.close}
            onTouchTap={this.props.onRequestClose}>
            <NavigationClose />
          </IconButton>
        }
        {this.props.onClick
          ? <div onClick={this.props.onClick}>{this.props.children}</div>
          : this.props.children
        }
      </MaterialDialog>
    )
  }
}

Dialog.propTypes = {
  onClick: PropTypes.func,
  onRequestClose: PropTypes.func.isRequired
}

Dialog.defaultProps = {
  autoDetectWindowHeight: false,
  style: {
    overflowY: 'auto'
  },
  contentStyle: {
    marginBottom: styleVariables.spacer.double,
    width: '90%'
  },
  titleStyle: {
    paddingBottom: '0px'
  }
}

const style = {
  close: {
    position: 'absolute',
    right: '0px',
    top: '-' + styleVariables.spacer.tripple
  },
  closeIcon: {
    color: 'white'
  }
}
