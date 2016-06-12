import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import { getAuthUserId } from '../../selectors/User.selectors'
import {
  getSupportedMaecenates
} from '../../selectors/Maecenate.selectors'
import * as Actions from '../../actions/actions'

import cropCloudy from '../../lib/cropCloudy'
import { Card, CardTitle } from '../../components/Card'
import { List, ListItem } from 'material-ui/List'
import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'

class YourMaecensContainer extends Component {

  componentDidMount () {
    const { dispatch, userId } = this.props
    dispatch(Actions.fetchSupportedMaecenateList(userId))
  }

  gotoMaecenate (slug) {
    browserHistory.push(`/maecenate/${slug}/content`)
  }

  render () {
    const { t, maecenates } = this.props

    return (
      <Card>
        <CardTitle title={t('user.maecenatesSupported')} />
        <List>
          {maecenates.map((maecenate, i) => (
            <div key={i}>
              {i > 0 &&
                <Divider />
              }
              <ListItem
                leftAvatar={<Avatar src={cropCloudy(maecenate.logo_url, 'logo')} />}
                primaryText={maecenate.title}
                onClick={this.gotoMaecenate.bind(this, maecenate.slug)}
              />
            </div>
          ))}
        </List>
      </Card>
    )
  }
}

function mapStateToProps (state, props) {
  const supportedMaecenates = getSupportedMaecenates(getAuthUserId)
  return {
    userId: getAuthUserId(state, props),
    maecenates: supportedMaecenates(state, props)
  }
}

export default translate(['common'])(
  connect(mapStateToProps)(YourMaecensContainer)
)
