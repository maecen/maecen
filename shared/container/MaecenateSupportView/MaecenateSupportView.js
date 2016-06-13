import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import axios from 'axios'
import { browserHistory } from 'react-router'

import * as Actions from '../../actions/actions'
import {
  isAuthorized, getAuthUser
} from '../../selectors/User.selectors'
import {
  getMaecenateBySlug
} from '../../selectors/Maecenate.selectors'

import ContentWrapper from '../../components/ContentWrapper/ContentWrapper'
import Card, { CardContent, CardError, CardTitle } from '../../components/Card'
import { Button, TextField } from '../../components/Form'
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
      success: false
    }
  }

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.hasAuth !== nextProps.hasAuth) {
      this.setState({ amountError: null })
    }
  }

  gotoContent () {
    const { slug } = this.props.maecenate
    browserHistory.push(`/maecenate/${slug}/content`)
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
      axios.post('/api/supportMaecenate', {
        maecenateId: maecenate.id,
        amount: Math.round(Number(this.state.amount))
      }).then(res => {
        return res.data
      }).then(data => {
        dispatch(Actions.updateEntities(data.entities))
        this.setState({ success: true })
      }, res => {
        this.setState({ errors: res.data.errors })
      })
    } else {
      dispatch(Actions.requireAuth())
    }
  }

  render () {
    const { maecenate, hasAuth, t } = this.props
    const continueLabel = hasAuth
      ? t('support.continueToPayment')
      : t('action.continue')

    return (
      <ContentWrapper>
        <Row>
          <Col smOffset={3} sm={6} xs={12}>
            <Card>
              {!this.state.success &&
                <CardTitle
                  title={t('support.joinMc', { title: maecenate.title })}
                  subtitle={t('support.howMuch')}
                />
              }

              {this.state.success &&
                <div>
                  <CardTitle
                    title={t('support.success', { title: maecenate.title })}
                  />
                  <CardContent>
                    <Button
                      primary={true}
                      label={t('post.see')}
                      onClick={this.gotoContent} />
                  </CardContent>
                </div>
              }

              {Object.keys(this.state.errors).length > 0 &&
                <CardError>
                  {this.state.errors._}
                </CardError>
              }

              {!this.state.success &&
                <CardContent>
                  <form
                    onSubmit={this.handleSubmit}>
                    <TextField
                      value={this.state.amount}
                      name='amount'
                      onChange={this.handleChange}
                      label={`Min. ${maecenate.monthly_minimum} ${t('currency.DKR')}`}
                      error={this.state.amountError}
                      style={{marginTop: '-16px'}}
                    />

                    <Button label={continueLabel}
                      type='submit'
                      secondary={true} />
                  </form>
                </CardContent>
              }
            </Card>
          </Col>
        </Row>
      </ContentWrapper>
    )
  }
}

MaecenateSupportView.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}]

function mapStateToProps (state, props) {
  return {
    hasAuth: isAuthorized(state),
    user: getAuthUser(state),
    maecenate: getMaecenateBySlug(state, props)
  }
}

export default connect(mapStateToProps)(
  translate(['common'])(MaecenateSupportView)
)
