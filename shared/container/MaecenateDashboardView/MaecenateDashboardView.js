// Imports
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import sumBy from 'lodash/sumBy'

// Utils
import { isBrowser } from '../../config'
import cropCloudy from '../../lib/cropCloudy'

// Actions & Selectors
import * as Actions from '../../actions'
import { getMaecenateBySlug } from '../../selectors/maecenate'
import { getSupportingUsers } from '../../selectors/user'

// Components
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import { List } from 'material-ui/List'
import { TextLink } from '../../components/Link'
import { Row, Cell } from '../../components/Grid'
import { Card, CardHeader, CardContent } from '../../components/Card'
import ListItem from '../../components/List/ListItem'
import Button from '../../components/Form/Button'
import styleVariables from '../../components/styleVariables'

import DeactivateMaecenateDialog from '../Dialogs/DeactivateMaecenateDialog'

class MaecenateDashboardView extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isDeactivateDialogOpen: false
    }

    this.closeDeactivateDialog = this.closeDeactivateDialog.bind(this)
    this.openDeactivateDialog = this.openDeactivateDialog.bind(this)
  }

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
    dispatch(this.constructor.need[1](params))
  }

  gotoMaecenatePresentation (slug, e) {
    browserHistory.push(`/maecenate/${slug}/presentation`)
  }

  linkToPresentation (slug) {
    // Have to check - otherwise it fails when refreshing the page
    if (isBrowser) {
      let rootDir = window.location.hostname
      return `${rootDir}/maecenate/${slug}/presentation`
    }
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
    const totalString = t('maecenate.totalAmount', { total: totalAmount })

    return (
      <Row>
        <DeactivateMaecenateDialog
          maecenate={maecenate}
          open={this.state.isDeactivateDialogOpen}
          close={this.closeDeactivateDialog}
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

              { maecenate.active
                ? <Button
                    label={t('maecenate.close')}
                    onClick={this.openDeactivateDialog}
                  />
                : <div style={style.closedMessage}>
                    {t('maecenate.closedMessage')}
                  </div>
              }

              <br />
              <p>
                {t('maecenate.linkToPresentation')}
                <TextLink
                  to={`https://${this.linkToPresentation(maecenate.slug)}`}>
                  {this.linkToPresentation(maecenate.slug)}
                </TextLink>
              </p>
            </CardContent>
            <Divider />
            <List>
              <Subheader>{t('user.yourMaecenes')}</Subheader>
              {
                users.map(user => (
                  <ListItem key={user.id}>
                    {user.first_name} {Math.round(user.support.amount / 100)}
                  </ListItem>
                ))
              }
              { users.length > 0
                ? <ListItem
                    key='total'
                    primaryText={totalString} />
                : <ListItem
                  primaryText={t('user.yourNoMaecenes')} />
              }
            </List>
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
  }
}

MaecenateDashboardView.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}, (params) => {
  return Actions.fetchMaecenateSupporter(params.slug)
}]

function mapStateToProps (state, props) {
  const getUsers = getSupportingUsers(getMaecenateBySlug)
  return {
    maecenate: getMaecenateBySlug(state, props),
    users: getUsers(state, props)
  }
}

export default translate(['common'])(
 connect(mapStateToProps)(MaecenateDashboardView)
)
