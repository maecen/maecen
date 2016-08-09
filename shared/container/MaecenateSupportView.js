import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import axios from 'axios'
import { browserHistory } from 'react-router'

import styleVariables from '../components/styleVariables'

import { isBrowser, isSmallDevice } from '../config'
import * as Actions from '../actions'
import { isAuthorized, getAuthUser } from '../selectors/user'
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
    const { dispatch } = this.props

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
    paymentWindow.on('close', () => {
      dispatch(Actions.fetchMaecenate(this.props.params.slug))
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

    return (isSupporter
      ? this.renderSuccess()
      : this.renderPayment()
    )
  }

  renderPayment () {
    const { maecenate, hasAuth, t } = this.props
    const continueLabel = hasAuth
      ? t('support.continueToPayment')
      : t('action.continue')

    return (
      <Row>
        <Col smOffset={3} sm={6} xs={12}>
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
        </Col>
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
          title='Congratulations!'
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

const spacer = styleVariables.spacer.base
const style = {
  card: {
    textAlign: 'center',
    margin: '0 auto',
    width: '25rem'
  },
  smiley: {
    width: '100px',
    height: '100px',
    paddingTop: spacer
  },
  content: {
    padding: `0 ${spacer} ${spacer}`
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
