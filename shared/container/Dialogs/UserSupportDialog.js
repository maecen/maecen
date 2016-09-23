// Imports
import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import axios from 'axios'
import moment from 'moment'

import styleVariables from '../../components/styleVariables'

import { getNextEndDate } from '../../lib/subscription'

// Actions & Selectors
import * as actions from '../../actions/actions'
import { getMaecenateById } from '../../selectors/maecenate'
import { getAuthUserSupportForMaecenate } from '../../selectors/support'

// Components
import Checkbox from 'material-ui/Checkbox'
import Dialog from '../../components/Dialog/Dialog'
import DialogTitle from '../../components/Dialog/Title'
import Button from '../../components/Form/Button'
import TextField from '../../components/Form/TextField'

class UserSupportDialog extends Component {

  constructor (props) {
    super(props)
    this.state = {
      change: null,
      submitting: false,
      amount: null
    }
    this.saveChanges = this.saveChanges.bind(this)
    this.cancelChanges = this.cancelChanges.bind(this)
    this.toggleCancel = this.toggleCancel.bind(this)
    this.onAmountChange = this.onAmountChange.bind(this)
  }

  componentWillUpdate (nextProps) {
    if (this.props.maecenateId !== nextProps.maecenateId) {
      this.setState({
        change: null,
        submitting: false
      })
    }
  }

  saveChanges () {
    const { updateEntities } = this.props
    const { change } = this.state
    this.setState({ submitting: true })

    let axiosReq = null
    if (change === 'cancel') {
      axiosReq = axios.put(`/api/cancelSubscription/${this.props.maecenateId}`)
    } else if (change === 'update') {
      axiosReq = axios.put(`/api/updateSubscription/${this.props.maecenateId}`, {
        amount: this.state.amount * 100
      })
    }

    axiosReq
    .then(res => res.data)
    .then(({ entities, success }) => {
      updateEntities(entities)
      this.props.close()
    })
    .catch(() => {})
    .then(() => {
      this.setState({ submitting: false })
    })
  }

  cancelChanges () {
    this.props.close()
  }

  toggleCancel (event, state) {
    this.setState({ change: state ? 'cancel' : null })
  }

  onAmountChange (event, value) {
    value = Number(value)
    const orignalValue = Math.round(this.props.support.amount / 100)
    const isValidNewAmount = value >= event.target.min && value !== orignalValue
    this.setState({
      change: isValidNewAmount ? 'update' : null,
      amount: value
    })
  }

  render () {
    console.log(moment.months())
    const { t, maecenate, support } = this.props
    const { change, submitting } = this.state
    const isValidSubmit = change !== null
    const confirmDisabled = !isValidSubmit || submitting
    let buttonTitle = t('ok')
    if (change === 'cancel') {
      buttonTitle = t('support.cancelSupport')
    } else if (change === 'update') {
      buttonTitle = t('support.changeSupport')
    }

    const open = Boolean(this.props.maecenateId)

    const actions = support && support.renew
      ? [
        <Button
          label={t('action.cancel')}
          flat={true}
          onClick={this.cancelChanges}
        />,
        <Button
          label={buttonTitle}
          onClick={this.saveChanges}
          primary={true}
          disabled={confirmDisabled}
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
    const {
      t,
      maecenate,
      support: { sub_start, renew, currency, end }
    } = this.props
    const { change } = this.state

    const renewDate = moment(end).subtract(1, 'days')
    const amount = Math.round(this.props.support.subscription_amount / 100)
    const minAmount = Math.round(maecenate.monthly_minimum)
    const title = renew
      ? t('support.editTitle', { title: maecenate.title })
      : maecenate.title

    const disabledInput = change === 'cancel' || this.state.submitting
    const isRenewedToday = renewDate.isSame(new Date(), 'day')
    const expireDate = isRenewedToday
      ? moment(getNextEndDate(end, sub_start, 1))
      : moment(end)

    const nextRenewDate = expireDate.clone().subtract(1, 'days')

    return (
      <div>
        <DialogTitle title={title} />
        { renew
          ? <div style={style.dialogText}>
              {isRenewedToday
                ? t('support.wasRenewedToday', { date: nextRenewDate })
                : t('support.willBeRenewedOn', { amount, currency,
                  date: renewDate })
              }

              <TextField
                floatingLabelText={t('support.changeAmount',
                  { minAmount, currency })}
                defaultValue={amount}
                type='number'
                min={minAmount}
                floatingLabelFixed={true}
                autoComplete='off'
                onChange={this.onAmountChange}
                disabled={disabledInput}
              />

              <Checkbox
                label={t('support.cancelSupport')}
                labelPosition='left'
                onCheck={this.toggleCancel}
                style={style.checkbox}
                inputStyle={style.checkboxInput}
              />

              { change === 'cancel' &&
                t('support.cancelSupportHelpText', { date: expireDate })
              }
            </div>
          : t('support.willExpireOn', { date: expireDate })
        }

      </div>
    )
  }
}

const style = {
  dialogContent: {
    maxWidth: styleVariables.media.sm
  },
  dialogText: {
    paddingTop: styleVariables.spacer.base
  },
  checkbox: {
    marginTop: styleVariables.spacer.base,
    marginBottom: styleVariables.spacer.base
  },
  checkboxInput: {
    marginLeft: styleVariables.spacer.half
  }
}

UserSupportDialog.propTypes = {
  maecenateId: PropTypes.string,
  maecenate: PropTypes.shape({
    title: PropTypes.string
  }),
  support: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    subscription_amount: PropTypes.number.isRequired,
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
