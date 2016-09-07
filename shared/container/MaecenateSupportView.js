// Imports
import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import axios from 'axios'
import { browserHistory } from 'react-router'

import { isBrowser, isSmallDevice } from '../config'
import styleVariables from '../components/styleVariables'

// Actions
import * as Actions from '../actions'

// Selectors
import {
  isAuthorized,
  getAuthUser,
  hasSavedPaymentCard
} from '../selectors/user'
import { getMaecenateBySlug } from '../selectors/maecenate'
import { isAuthUserMaecenateSupporter } from '../selectors/support'

// Components
import Checkbox from 'material-ui/Checkbox'
import { TextLink } from '../components/Link'
import { Table, TableBody, TableRow, TableRowColumn } from '../components/Table'
import Card, { CardContent, CardError, CardTitle } from '../components/Card'
import { Button, TextField } from '../components/Form'
import { Row, Cell } from '../components/Grid'
import HappyIcon from 'material-ui/svg-icons/social/mood'

class MaecenateSupportView extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      amount: '',
      amountError: null,
      errors: {},
      success: false,
      display: 'amount', // amount | confirm
      epayScriptLoaded: false,
      isSubmitting: false,
      acceptedTerms: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.gotoContent = this.gotoContent.bind(this)
    this.paymentComplete = this.paymentComplete.bind(this)
    this.triggerAcceptTerms = this.triggerAcceptTerms.bind(this)
  }

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
    dispatch(this.constructor.need[1](params))
    this.loadExternalEpayScript()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.hasAuth !== nextProps.hasAuth) {
      this.setState({ amountError: null })
    }
  }

  triggerAcceptTerms (e, isChecked) {
    this.setState({ acceptedTerms: isChecked })
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
    const { maecenate, hasAuth, t, user } = this.props
    const { amount } = this.state
    const continueLabel = hasAuth
      ? t('support.continueToPayment')
      : t('action.continue')
    const cardTitle = this.state.display === 'amount'
      ? t('support.joinMaecenate', { title: maecenate.title })
      : t('support.confirmSupport')

    const disableSubmit = !this.state.epayScriptLoaded ||
      this.state.isSubmitting || !this.state.acceptedTerms

    return (
      <Row>
        <Cell narrowerLayout={true}>
          <Card>
            <CardTitle
              title={cardTitle}
            />
            {Object.keys(this.state.errors).length > 0 &&
              <CardError>
                {this.state.errors._}
              </CardError>
            }

            {this.state.display === 'amount' &&
              <CardContent>
                {t('support.subscriptionExplanation')}
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
                    type='number'
                    min={maecenate.monthly_minimum}
                    floatingLabelFixed={true}
                    floatingLabelStyle={style.fixedLabel}
                    autoComplete='off'
                    error={this.state.amountError}
                  />
                  <Row style={style.acceptTermsCheck}>
                    <Cell sm={1}>
                      <Checkbox onCheck={this.triggerAcceptTerms} />
                    </Cell>
                    <Cell sm={9} style={style.acceptTermsLabel}>
                      <TextLink to='/terms' target='_blank' style={style.termsLink}>
                        {t('support.acceptTerms')}
                      </TextLink>
                    </Cell>
                  </Row>
                  <div style={style.amountButton}>
                    <Button label={continueLabel}
                      type='submit'
                      secondary={true}
                      last={true}
                      disabled={disableSubmit}
                    />
                  </div>
                </form>
                <div id='payment-holder' />
              </CardContent>
            }

            {this.state.display === 'confirm' &&
              <CardContent>
                <Table selectable={false}>
                  <TableBody displayRowCheckbox={false}>
                    <TableRow>
                      <TableRowColumn>
                        {t('maecenateName')}
                      </TableRowColumn>
                      <TableRowColumn>
                        {maecenate.title}
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>
                        {t('support.monthlyAmount')}
                      </TableRowColumn>
                      <TableRowColumn>
                        {t('currency.amount', {count: amount, context: 'DKK'})}
                      </TableRowColumn>
                    </TableRow>
                    <TableRow>
                      <TableRowColumn>
                        {t('creditCard')}
                      </TableRowColumn>
                      <TableRowColumn>
                        {user.payment_card}
                      </TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
                <div style={style.amountButton}>
                  <Button label={t('support.confirmSubscription')}
                    type='submit'
                    secondary={true}
                    last={true}
                    onClick={this.handleSubmit}
                    disabled={disableSubmit} />
                </div>
              </CardContent>
            }
          </Card>
        </Cell>
      </Row>
    )
  }

  renderSuccess () {
    const { maecenate, t } = this.props

    return (
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
    )
  }
}

const spacer = styleVariables.spacer
const style = {
  card: {
    textAlign: 'center',
    display: 'inline-block',
    margin: '0 auto',
    alignSelf: 'flex-start'
  },
  smiley: {
    width: '100px',
    height: '100px',
    paddingTop: spacer.base
  },
  content: {
    padding: `0 ${spacer.double} ${spacer.base}`
  },
  amountButton: {
    textAlign: 'right',
    marginTop: spacer.base
  },
  amountTextField: {
    marginTop: `-${spacer.base}`
  },
  fixedLabel: {
    color: styleVariables.color.cardText
  },
  acceptTermsCheck: {
    marginTop: '12px'
  },
  acceptTermsLabel: {
    marginTop: '-2px'
  },
  termsLink: {
    textDecoration: 'underline'
  }
}

MaecenateSupportView.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}, (params) => {
  return Actions.fetchAuthUser()
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
