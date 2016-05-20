import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import filter from 'lodash/filter'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import * as Actions from '../../actions/actions'

import { Card, CardTitle } from '../../components/Card'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'

class YourMaecenatesContainer extends Component {

  componentDidMount () {
    const { dispatch, userId } = this.props
    dispatch(Actions.fetchUserMaecenateList(userId))
  }

  gotoMaecenate (slug) {
    browserHistory.push(`/maecenate/${slug}`)
  }

  createMaecenate (slug) {
    browserHistory.push('create-maecenate')
  }

  render () {
    const { t, maecenates } = this.props

    return (
      <Card>
        <CardTitle title={t('user.yourMaecenates')} />
        <List>
          {maecenates.map((maecenate) => (
            <ListItem
              primaryText={maecenate.title}
              onClick={this.gotoMaecenate.bind(this, maecenate.slug)}
            />
          ))}
          <Divider />
          <ListItem
            primaryText={t('mc.createMaecenate')}
            onClick={this.createMaecenate.bind(this)}
          />
        </List>
      </Card>
    )
  }
}

YourMaecenatesContainer.need = []

function mapStateToProps (store) {
  const { app, entities } = store
  const userId = app.authUser || null
  const allMaecenates = entities.maecenates || []
  const maecenates = filter(allMaecenates, maecenate =>
    maecenate.creator === userId)

  return {
    userId,
    maecenates
  }
}

export default translate(['common'])(
  connect(mapStateToProps)(YourMaecenatesContainer)
)

