// Imports
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import sumBy from 'lodash/sumBy'
import moment from 'moment'

// Utils
import { isBrowser } from '../../config'
import cropCloudy from '../../lib/cropCloudy'
import styleVariables from '../../components/styleVariables'

// Actions & Selectors
import * as Actions from '../../actions'
import { fetchMaecenateDetails } from '../../ducks/maecenates'
import { getMaecenateBySlug, getMaecenateDetails } from '../../selectors/maecenate'
import { getSupportingUsers } from '../../selectors/user'

// Components
import { TextLink } from '../../components/Link'
import { Row, Cell } from '../../components/Grid'
import { Card, CardHeader, CardContent } from '../../components/Card'
import Button from '../../components/Form/Button'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from '../../components/Table/'
import DeactivateMaecenateDialog from '../Dialogs/DeactivateMaecenateDialog'
import EmailSupportersDialog from '../Dialogs/EmailSupportersDialog'

class MaecenateDashboardView extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isDeactivateDialogOpen: false,
      isEmailSupportersDialogOpen: false
    }

    this.closeDeactivateDialog = this.closeDeactivateDialog.bind(this)
    this.openDeactivateDialog = this.openDeactivateDialog.bind(this)
    this.openEmailSupportersDialog = this.openEmailSupportersDialog.bind(this)
    this.closeEmailSupportersDialog = this.closeEmailSupportersDialog.bind(this)
  }

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
    dispatch(this.constructor.need[1](params))
    dispatch(this.constructor.need[2](params))
  }

  gotoMaecenatePresentation (slug, e) {
    browserHistory.push(`/${slug}/presentation`)
  }

  linkToPresentation (slug) {
    // Have to check - otherwise it fails when refreshing the page
    if (isBrowser) {
      let rootDir = window.location.hostname
      return `${rootDir}/${slug}`
    }
  }

  openEmailSupportersDialog () {
    this.setState({ isEmailSupportersDialogOpen: true })
  }

  closeEmailSupportersDialog () {
    this.setState({ isEmailSupportersDialogOpen: false })
  }

  openDeactivateDialog () {
    this.setState({ isDeactivateDialogOpen: true })
  }

  closeDeactivateDialog () {
    this.setState({ isDeactivateDialogOpen: false })
  }

  render () {
    const { users, maecenate, t } = this.props
    const totalAmount = Math.round(sumBy(users, o => o.support.amount) / 100)
    const totalAmountString =
      this.props.details && t('maecenate.admin.totalEarned', {
        amount: this.props.details.totalEarned / 100
      })

    return (
      <Row>
        <DeactivateMaecenateDialog
          maecenate={maecenate}
          open={this.state.isDeactivateDialogOpen}
          close={this.closeDeactivateDialog}
        />

        <EmailSupportersDialog
          maecenate={maecenate}
          open={this.state.isEmailSupportersDialogOpen}
          close={this.closeEmailSupportersDialog}
        />

        <Cell>
          <Card>
            <CardHeader
              title={maecenate.title}
              subtitle={t('maecenate.dashboard')}
              avatar={maecenate.logo && cropCloudy(maecenate.logo.url, 'logo-tiny')}
            />

            <CardContent>
              <Button
                label={t('maecenate.viewPresentation')}
                primary={true}
                onClick={this.gotoMaecenatePresentation.bind(this, maecenate.slug)}
              />

              <Button
                label={t('maecenate.admin.emailSupportersBtn')}
                onClick={this.openEmailSupportersDialog}
              />

              { maecenate.active
                ? <Button
                    label={t('maecenate.close')}
                    onClick={this.openDeactivateDialog}
                  />
                : <div style={style.closedMessage}>
                    {t('maecenate.closedMessage')}
                  </div>
              }
              { maecenate.active && users.length < 5 &&
                <p>
                  {t('user.yourNoFiveMaecenes')}
                </p>
              }

              <p>
                {t('maecenate.linkToPresentation')}
                <TextLink
                  to={`https://${this.linkToPresentation(maecenate.slug)}`}>
                  {this.linkToPresentation(maecenate.slug)}
                </TextLink>
              </p>
            </CardContent>
            { users.length > 0
              ? <div>
                  <CardContent>
                    { t('maecenate.totalAmount', { amount: totalAmount }) }
                    {'\u00A0'}
                    { totalAmountString }
                  </CardContent>
                  <Table
                    fixedHeader={false}
                    selectable={false}
                    multiSelectable={false}
                  >
                    <TableHeader
                      displaySelectAll={false}
                      adjustForCheckbox={false}
                      enableSelectAll={false}
                    >
                      <TableRow>
                        <TableHeaderColumn style={style.column}>
                          {t('name')}
                        </TableHeaderColumn>
                        <TableHeaderColumn style={style.column}>
                          {t('email')}
                        </TableHeaderColumn>
                        <TableHeaderColumn style={style.column}>
                          {t('zipCode')}
                        </TableHeaderColumn>
                        <TableHeaderColumn style={style.column}>
                          {t('amount')}
                        </TableHeaderColumn>
                        <TableHeaderColumn style={style.column}>
                          {t('startDate')}
                        </TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody
                      displayRowCheckbox={false}
                      showRowHover={false}
                    >
                      {
                        users.map(user => (
                          <TableRow key={user.id}>
                            <TableRowColumn style={style.column}>
                              {user.first_name}&nbsp;{user.last_name}
                            </TableRowColumn>
                            <TableRowColumn style={style.column}>
                              {user.email}
                            </TableRowColumn>
                            <TableRowColumn style={style.column}>
                              {user.zip_code}
                            </TableRowColumn>
                            <TableRowColumn style={style.column}>
                              {Math.round(user.support.amount / 100)}
                              &nbsp;
                              {user.support.currency}
                            </TableRowColumn>
                            <TableRowColumn style={style.column}>
                              { moment(user.support.sub_start).format('LL') }
                            </TableRowColumn>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </div>
              : totalAmountString
            }
          </Card>
        </Cell>
      </Row>
    )
  }
}

const style = {
  closedMessage: {
    color: styleVariables.color.alert,
    paddingTop: styleVariables.spacer.base
  },
  column: {
    paddingLeft: styleVariables.spacer.base,
    paddingRight: styleVariables.spacer.base
  }
}

MaecenateDashboardView.need = [
  params => Actions.fetchMaecenate(params.slug),
  params => Actions.fetchMaecenateSupporter(params.slug),
  params => fetchMaecenateDetails(params.slug)
]

function mapStateToProps (state, props) {
  const getUsers = getSupportingUsers(getMaecenateBySlug)
  return {
    maecenate: getMaecenateBySlug(state, props),
    details: getMaecenateDetails(state, props),
    users: getUsers(state, props)
  }
}

export default translate(['common'])(
 connect(mapStateToProps)(MaecenateDashboardView)
)
