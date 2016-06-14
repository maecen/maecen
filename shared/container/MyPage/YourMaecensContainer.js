import React, { Component } from 'react'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import { getAuthUserId } from '../../selectors/User.selectors'
import {
  getSupportedMaecenates
} from '../../selectors/Maecenate.selectors'
import * as Actions from '../../actions/actions'

import cropCloudy from '../../lib/cropCloudy'
import { Card, CardTitle, CardContent } from '../../components/Card'
import Button from '../../components/Form/Button'
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
    let title = t('user.maecenatesSupported')
    if (maecenates.length === 0) {
      title = t('user.noMaecenatesSupported')
    }
    return (
      <Card>
        <CardTitle
          title={title}
        />
        {maecenates.length > 0 &&
          <List>
            {maecenates.map((maecenate, i) => (
              <div key={i}>
                {i > 0 &&
                  <Divider />
                }
                <ListItem
                  leftAvatar={
                    <Avatar
                      src={maecenate.logo && cropCloudy(maecenate.logo.url, 'logo-tiny')}
                    />
                  }
                  primaryText={maecenate.title}
                  onClick={this.gotoMaecenate.bind(this, maecenate.slug)}
                />
              </div>
            ))}
          </List>
        }
        {maecenates.length === 0 &&
          <CardContent>
            <Link to='/maecenates'>
              <Button primary={true} label={t('maecenate.seeAll')} />
            </Link>
          </CardContent>
        }
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
