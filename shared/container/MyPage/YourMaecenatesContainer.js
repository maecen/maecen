import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import filter from 'lodash/filter'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import * as Actions from '../../actions/actions'

import { Card, CardTitle, CardContent } from '../../components/Card'
import Button from '../../components/Form/Button'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import cropCloudy from '../../lib/cropCloudy'
import Avatar from 'material-ui/Avatar'

class YourMaecenatesContainer extends Component {

  componentDidMount () {
    const { dispatch, userId } = this.props
    dispatch(Actions.fetchUserMaecenateList(userId))
  }

  gotoMaecenate (slug) {
    browserHistory.push(`/maecenate/${slug}`)
    console.log('gotoMaecenate')
  }

  gotoMaecenateDashboard (slug) {
    browserHistory.push(`/maecenate/${slug}/dashboard`)
    console.log('gotoMaecenateDashboard')
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
          {maecenates.map((maecenate, i) => (
            <div key={i}>
              <ListItem
                leftAvatar={
                  <Avatar src={cropCloudy(maecenate.logo_url, 'logo')} />
                }
                primaryText={maecenate.title}
                onClick={this.gotoMaecenate.bind(this, maecenate.slug)}
                rightIconButton={
                  <Button
                    label={t('mc.dashboard')}
                    flat={true}
                    onClick={
                      this.gotoMaecenateDashboard.bind(this, maecenate.slug)
                    }
                    style={{marginTop: '5px'}}
                  />
                }
              />
              <Divider />
            </div>
          ))}
        </List>
        <CardContent>
          <Button
            label={t('mc.create')}
            primary={true}
            onClick={this.createMaecenate.bind(this)}
          />
        </CardContent>
      </Card>
    )
  }
}

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
