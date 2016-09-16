// Imports
import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import axios from 'axios'
import moment from 'moment'

import styleVariables from '../../components/styleVariables'

// Actions & Selectors
import * as actions from '../../actions/actions'
import { getMaecenateById } from '../../selectors/maecenate'
import { getAuthUserSupportForMaecenate } from '../../selectors/support'

// Components
import Checkbox from 'material-ui/Checkbox'
import Dialog from '../../components/Dialog/Dialog'
import DialogTitle from '../../components/Dialog/Title'
import Button from '../../components/Form/Button'

class UserSupportDialog extends Component {

  constructor (props) {
    super(props)
    this.state = {
      cancelSubscription: false,
      submitting: false
    }
    this.saveChanges = this.saveChanges.bind(this)
    this.cancelChanges = this.cancelChanges.bind(this)
    this.triggerCancel = this.triggerCancel.bind(this)
  }

  componentWillUpdate (nextProps) {
    if (this.props.maecenateId !== nextProps.maecenateId) {
      this.setState({
        cancelSubscription: false,
        submitting: false
      })
    }
  }

  saveChanges () {
    const { updateEntities } = this.props

    this.setState({ submitting: true })
    axios.put(`/api/cancelSubscription/${this.props.maecenateId}`)
    .then(res => res.data)
    .then(({ entities, success }) => {
      updateEntities(entities)
      this.setState({ submitting: false })
      this.props.close()
    })
  }

  cancelChanges () {
    this.props.close()
  }

  triggerCancel (event, state) {
    this.setState({ cancelSubscription: state })
  }

  render () {
    const { t, maecenate, support } = this.props
    const disabled = this.state.cancelSubscription === false ||
      this.state.submitting
    const open = Boolean(this.props.maecenateId)

    const actions = support && support.renew
      ? [
        <Button
          label={t('action.cancel')}
          flat={true}
          onClick={this.cancelChanges}
        />,
        <Button
          label={t('support.stopSupportConfirm')}
          onClick={this.saveChanges}
          primary={true}
          disabled={disabled}
        />
      ]
      : null

    return (
      <Dialog
        open={open}
        onRequestClose={this.props.close}
        contentStyle={style.dialogContent}
        actions={actions}
      >
        { maecenate && support
          ? this.renderContent()
          : <span>Loading...</span>
        }
      </Dialog>
    )
  }

  renderContent () {
    const { t, maecenate, support } = this.props
    const { renew, currency, end } = support
    const renewDate = moment(end).subtract(1, 'days')
    const expireDate = moment(end)
    const amount = Math.round(this.props.support.amount / 100)
    const title = t('support.editTitle', { title: maecenate.title })

    return (
      <div>
        <DialogTitle title={title} />
        { renew
          ? <div>
              {t('support.willBeRenewedOn', { date: renewDate })}
              <br />
              {t('support.currentAmount', { amount, currency })}
              <br /><br />
              <Checkbox
                label={`Stop supporting ${maecenate.title}`}
                onCheck={this.triggerCancel}
              />
              { this.state.cancelSubscription &&
                `Click update to stop supporting, you will still have access to the maecenate until ${expireDate.format('LL')}. This can not be undone!`
              }
            </div>
          : t('support.willExpireOn', { date: expireDate })
        }

      </div>
    )
  }

  renderCancelSuccess () {
    return (
      <div>
        <DialogTitle title='walla' />
        Success!
      </div>
    )
  }
}

const style = {
  dialogContent: {
    maxWidth: styleVariables.media.sm
  }
}

UserSupportDialog.propTypes = {
  maecenateId: PropTypes.string,
  maecenate: PropTypes.shape({
    title: PropTypes.string
  }),
  support: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    renew: PropTypes.bool.isRequired
  }),
  close: PropTypes.func
}

function mapStateToProps (state, props) {
  const getSupport = getAuthUserSupportForMaecenate(getMaecenateById)

  return {
    maecenate: getMaecenateById(state, props),
    support: getSupport(state, props)
  }
}

export default translate(['common'])(
  connect(mapStateToProps, actions)(UserSupportDialog)
)
