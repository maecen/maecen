import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import axios from 'axios'
import { browserHistory } from 'react-router'

import styleVariables from '../components/styleVariables'

import { isBrowser, isSmallDevice } from '../config'
import * as Actions from '../actions'
import {
  isAuthorized,
  getAuthUser,
  hasSavedPaymentCard
} from '../selectors/user'
import { getMaecenateBySlug } from '../selectors/maecenate'
import { isAuthUserMaecenateSupporter } from '../selectors/support'

import Card, { CardContent, CardError, CardTitle } from '../components/Card'
import { Button, TextField } from '../components/Form'
import { Row, Col } from 'react-flexbox-grid/lib'
import HappyIcon from 'material-ui/svg-icons/social/mood'

class MaecenateSupportView extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.gotoContent = this.gotoContent.bind(this)
    this.paymentComplete = this.paymentComplete.bind(this)

    this.state = {
      amount: '',
      amountError: null,
      errors: {},
      success: false,
      display: 'amount', // amount | confirm
      epayScriptLoaded: false,
      isSubmitting: false
    }
  }

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
    this.loadExternalEpayScript()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.hasAuth !== nextProps.hasAuth) {
      this.setState({ amountError: null })
    }
  }

  loadExternalEpayScript () {
    if (isBrowser === false) { return }

    const epayScript = 'https://ssl.ditonlinebetalingssystem.dk' +
      '/integration/ewindow/paymentwindow.js'

    if (typeof window.PaymentWindow === 'undefined') {
      const $script = require('scriptjs')
      $script(epayScript, () => {
        this.setState({ epayScriptLoaded: true })
      })
    } else {
      this.setState({ epayScriptLoaded: true })
    }
  }

  openEpayPayment (options) {
    if (isSmallDevice) {
      options = {
        ...options,
        accepturl: `${window.location.href}`
      }
    }

    const paymentWindow = new PaymentWindow(options) // eslint-disable-line no-undef

    // We fetch the maecenate again when the payment window has been closed to
    // check if the payment has gone through (a support object will be included
    // from the server)
    paymentWindow.on('close', this.paymentComplete)

    paymentWindow.open()
  }

  paymentComplete () {
    const { dispatch } = this.props
    return dispatch(Actions.fetchMaecenate(this.props.params.slug))
  }

  gotoContent () {
    const { slug } = this.props.maecenate
    browserHistory.push(`/maecenate/${slug}`)
  }

  handleChange (e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    const { dispatch, maecenate, hasAuth, hasSavedPaymentCard, t } = this.props
    const { display } = this.state

    if (hasSavedPaymentCard && display === 'amount') {
      this.setState({display: 'confirm'})
      return
    }

    if (this.state.amount < maecenate.monthly_minimum) {
      this.setState({
        amountError: t('support.belowMin')
      })
      return
    }

    if (hasAuth === true) {
      this.setState({isSubmitting: true})
      axios.post('/api/maecenates/initiate-payment', {
        maecenateId: maecenate.id,
        amount: Math.round(Number(this.state.amount)) * 100
      }).then(res => {
        this.setState({ errors: {} })
        return res.data
      }).then((data) => {
        if (data.paymentComplete === true) {
          return this.paymentComplete()
        } else {
          this.openEpayPayment(data.epayPaymentParams)
        }
      }).catch(err => {
        if (err.data && err.data.errors) {
          this.setState({ errors: err.data.errors })
        }
      }).then(() => {
        this.setState({isSubmitting: false})
      })
    } else {
      dispatch(Actions.requireAuth())
    }
  }

  render () {
    const { isSupporter } = this.props

    return (isSupporter
      ? this.renderSuccess()
      : this.renderPayment()
    )
  }

  renderPayment () {
    const { maecenate, hasAuth, t } = this.props
    const { amount } = this.state
    const continueLabel = hasAuth
      ? t('support.continueToPayment')
      : t('action.continue')

    const disableSubmit = !this.state.epayScriptLoaded || this.state.isSubmitting

    return (
      <Row>
        <Col smOffset={3} sm={6} xs={12}>
          <Card>
            <CardTitle
              title={t('support.joinMaecenate', { title: maecenate.title })}
            />
            {Object.keys(this.state.errors).length > 0 &&
              <CardError>
                {this.state.errors._}
              </CardError>
            }

            {this.state.display === 'amount' &&
              <CardContent>
                <form
                  onSubmit={this.handleSubmit}>
                  <TextField
                    value={this.state.amount}
                    name='amount'
                    onChange={this.handleChange}
                    label={t('support.howMuch')}
                    placeholder={t('support.minimumAmount', {
                      context: 'DKK',
                      count: maecenate.monthly_minimum
                    })}
                    floatingLabelFixed={true}
                    autoComplete='off'
                    error={this.state.amountError}
                    style={{marginTop: '-16px'}}
                  />

                  <Button label={continueLabel}
                    type='submit'
                    secondary={true}
                    disabled={disableSubmit} />
                </form>
                <div id='payment-holder' />
              </CardContent>
            }

            {this.state.display === 'confirm' &&
              <CardContent>
                <div>
                  Total: {t('currency.amount', {count: amount, context: 'DKK'})}
                </div>
                <Button label='Confirm Payment' // Need i18n
                  type='submit'
                  secondary={true}
                  onClick={this.handleSubmit}
                  disabled={disableSubmit} />
              </CardContent>
            }
          </Card>
        </Col>
      </Row>
    )
  }

  renderSuccess () {
    const { maecenate, t } = this.props

    return (
      <div style={style.cardWrap}>
        <Card style={style.card}>
          <div>
            <HappyIcon
              style={style.smiley}
              color={styleVariables.color.gray}
            />
          </div>
          <CardTitle
            title={t('support.congratulations')}
            subtitle={t('support.success', { title: maecenate.title })}
          />
          <CardContent style={style.content}>
            <Button
              primary={true}
              label={t('maecenate.seeWithContent', { title: maecenate.title })}
              onClick={this.gotoContent}
            />
          </CardContent>
        </Card>
      </div>
    )
  }
}

const spacer = styleVariables.spacer.base
const spacerDouble = styleVariables.spacer.double
const style = {
  cardWrap: {
    display: 'flex',
    justifyContent: 'center'
  },
  card: {
    textAlign: 'center',
    display: 'inline-block'
  },
  smiley: {
    width: '100px',
    height: '100px',
    paddingTop: spacer
  },
  content: {
    padding: `0 ${spacerDouble} ${spacer}`
  }
}

MaecenateSupportView.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}]

function mapStateToProps (state, props) {
  const isSupporter = isAuthUserMaecenateSupporter(getMaecenateBySlug)
  const userHasSavedPaymentCard = hasSavedPaymentCard(getAuthUser)

  return {
    hasAuth: isAuthorized(state),
    user: getAuthUser(state),
    maecenate: getMaecenateBySlug(state, props),
    isSupporter: isSupporter(state, props),
    hasSavedPaymentCard: userHasSavedPaymentCard(state, props)
  }
}

export default connect(mapStateToProps)(
  translate(['common'])(MaecenateSupportView)
)
