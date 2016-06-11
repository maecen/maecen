import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import * as Actions from '../../actions/actions'
import { getMaecenateBySlug } from '../../selectors/Maecenate.selectors'
import { getCurrentUsersWithSupports } from '../../selectors/User.selectors'

import ContentWrapper from '../../components/ContentWrapper/ContentWrapper'

class MaecenateDashboardView extends Component {

  componentDidMount () {
    const { dispatch, params } = this.props
    dispatch(this.constructor.need[0](params))
    dispatch(this.constructor.need[1](params))
  }

  render () {
    const { users } = this.props

    return (
      <ContentWrapper>
        Holla motherfucker!
        {users.map(user => (
          <div>{user.first_name} {user.support.amount}</div>
        ))}
      </ContentWrapper>
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

