import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import axios from 'axios'
import { browserHistory } from 'react-router'

import { isBrowser } from '../config'
import * as Actions from '../actions'
import { isAuthorized, getAuthUser } from '../selectors/user'
import { getMaecenateBySlug } from '../selectors/maecenate'
import { isAuthUserMaecenateSupporter } from '../selectors/support'

import Card, { CardContent, CardError, CardTitle } from '../components/Card'
import { Button, TextField } from '../components/Form'
import { Row, Col } from 'react-flexbox-grid/lib'

class MaecenateSupportView extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.gotoContent = this.gotoContent.bind(this)

    this.state = {
      amount: '',
      amountError: null,
      errors: {},
      success: false,
      epayScriptLoaded: false
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
    const paymentWindow = new PaymentWindow(options) // eslint-disable-line no-undef
    paymentWindow.on('completed', () => {
      return Actions.fetchMaecenate(this.props.params.slug)
    })
    paymentWindow.open()
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
    const { dispatch, maecenate, hasAuth, t } = this.props

    if (this.state.amount < maecenate.monthly_minimum) {
      this.setState({
        amountError: t('support.belowMin')
      })
      return
    }

    if (hasAuth === true) {
      axios.post('/api/maecenates/initiate-payment', {
        maecenateId: maecenate.id,
        amount: Math.round(Number(this.state.amount)) * 100
      }).then(res => {
        return res.data
      }).then((params) => {
        this.openEpayPayment(params)
      })
    } else {
      dispatch(Actions.requireAuth())
    }
  }

  render () {
    const { isSupporter } = this.props

    return (
      <Row>
        <Col smOffset={3} sm={6} xs={12}>
          {isSupporter
            ? this.renderSuccess()
            : this.renderPayment()
          }
        </Col>
      </Row>
    )
  }

  renderPayment () {
    const { maecenate, hasAuth, t } = this.props
    const continueLabel = hasAuth
      ? t('support.continueToPayment')
      : t('action.continue')

    return (
      <Card>
        <CardTitle
          title={t('support.joinMaecenate', { title: maecenate.title })}
          subtitle={t('support.howMuch')}
        />
        {Object.keys(this.state.errors).length > 0 &&
          <CardError>
            {this.state.errors._}
          </CardError>
        }
        <CardContent>
          <form
            onSubmit={this.handleSubmit}>
            <TextField
              value={this.state.amount}
              name='amount'
              onChange={this.handleChange}
              label={t('support.minimumAmount', {
                context: 'DKK',
                count: maecenate.monthly_minimum
              })}
              error={this.state.amountError}
              style={{marginTop: '-16px'}}
            />

            <Button label={continueLabel}
              type='submit'
              secondary={true}
              disabled={!this.state.epayScriptLoaded} />
          </form>
          <div id='payment-holder' />
        </CardContent>
      </Card>
    )
  }

  renderSuccess () {
    const { maecenate, t } = this.props

    return (
      <Card>
        <CardTitle
          title={t('support.success', { title: maecenate.title })}
        />
        <CardContent>
          <Button
            primary={true}
            label={t('post.see')}
            onClick={this.gotoContent} />
        </CardContent>
      </Card>
    )
  }
}

MaecenateSupportView.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}]

function mapStateToProps (state, props) {
  const isSupporter = isAuthUserMaecenateSupporter(getMaecenateBySlug)

  return {
    hasAuth: isAuthorized(state),
    user: getAuthUser(state),
    maecenate: getMaecenateBySlug(state, props),
    isSupporter: isSupporter(state, props)
  }
}

export default connect(mapStateToProps)(
  translate(['common'])(MaecenateSupportView)
)