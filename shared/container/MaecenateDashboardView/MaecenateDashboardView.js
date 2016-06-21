import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import sumBy from 'lodash/sumBy'

import * as Actions from '../../actions/actions'
import { getMaecenateBySlug } from '../../selectors/Maecenate.selectors'
import { getCurrentUsersWithSupports } from '../../selectors/User.selectors'

import { Card, CardTitle } from '../../components/Card'
import { List, ListItem } from 'material-ui/List'

class MaecenateDashboardView extends Component {

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
    dispatch(this.constructor.need[1](params))
  }

  render () {
    const { users, maecenate, t } = this.props
    const totalAmount = sumBy(users, o => o.support.amount)

    return (
      <Card>
        <CardTitle
          subtitle={t('user.yourMaecenes')}
          title={maecenate.title}
        />
        <List>
          {
            users.map(user => (
              <ListItem key={user.id}>
                {user.first_name} {user.support.amount}
              </ListItem>
            ))
          }
          <ListItem
            key='total'
            primaryText={`Total ${totalAmount} DKK per month`} />
        </List>
      </Card>
    )
  }
}

MaecenateDashboardView.need = [(params) => {
  return Actions.fetchMaecenate(params.slug)
}, (params) => {
  return Actions.fetchMaecenateSupporterList(params.slug)
}]

function mapStateToProps (state, props) {
  const getUsers = getCurrentUsersWithSupports(getMaecenateBySlug)
  return {
    maecenate: getMaecenateBySlug(state, props),
    users: getUsers(state, props)
  }
}

export default translate(['common'])(
 connect(mapStateToProps)(MaecenateDashboardView)
)
