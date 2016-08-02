import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import * as Actions from '../../actions'

import { getAuthUserId } from '../../selectors/user'
import { getUserMaecenates } from '../../selectors/maecenate'

import { Card, CardTitle, CardContent } from '../../components/Card'
import Button from '../../components/Form/Button'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import cropCloudy from '../../lib/cropCloudy'
import Avatar from 'material-ui/Avatar'
import ActionInfo from 'material-ui/svg-icons/action/info-outline'

class YourMaecenatesContainer extends Component {

  componentDidMount () {
    const { dispatch, userId } = this.props
    dispatch(Actions.fetchAdminMaecenates(userId))
  }

  gotoMaecenate (slug) {
    browserHistory.push(`/maecenate/${slug}`)
  }

  gotoMaecenateDashboard (slug, e) {
    e.stopPropagation()
    browserHistory.push(`/maecenate/${slug}/dashboard`)
    event.stop
  }

  createMaecenate (slug) {
    browserHistory.push('maecenate/create')
  }

  render () {
    const { t, maecenates } = this.props
    let title = t('user.yourMaecenates')
    if (maecenates.length === 0) {
      title = t('user.yourNoMaecenates')
    }

    return (
      <Card>
        <CardTitle title={title} />
        {maecenates.length > 0 &&
          <List>
            {maecenates.map((maecenate, i) => (
              <div key={i}>
                <ListItem
                  leftAvatar={
                    <Avatar
                      src={maecenate.logo && cropCloudy(maecenate.logo.url, 'logo-tiny')}
                    />
                  }
                  primaryText={maecenate.title}
                  onClick={this.gotoMaecenate.bind(this, maecenate.slug)}
                  /* TODO this should probably be default for all list items */
                  innerDivStyle={{wordWrap: 'break-word'}}
                  rightIcon={
                    <ActionInfo
                      style={{width: '30px', height: '30px', margin: '9px'}}
                      onClick={
                        this.gotoMaecenateDashboard.bind(this, maecenate.slug)
                      }
                    />
                  }
                />
                <Divider />
              </div>
            ))}
          </List>
        }
        <CardContent style={{textAlign: 'right'}}>
          <Button
            last={true}
            label={t('maecenate.create')}
            primary={true}
            onClick={this.createMaecenate.bind(this)}
          />
        </CardContent>
      </Card>
    )
  }
}

function mapStateToProps (state) {
  const getMaecenates = getUserMaecenates(getAuthUserId)

  return {
    userId: getAuthUserId(state),
    maecenates: getMaecenates(state)
  }
}

export default translate(['common'])(
  connect(mapStateToProps)(YourMaecenatesContainer)
)
