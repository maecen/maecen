// Imports
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

// Actions & Selectors
import * as Actions from '../../actions'
import { getAuthUserId } from '../../selectors/user'
import { getUserMaecenates } from '../../selectors/maecenate'

// Components
import { List } from 'material-ui/List'
import { Card, CardTitle, CardContent } from '../../components/Card'
import Button from '../../components/Form/Button'
import MaecenateListItem from '../../components/Maecenate/MaecenateListItem'

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
            {maecenates.map((m, i) =>
              <MaecenateListItem
                key={i}
                maecenate={m}
                onClick={this.gotoMaecenate.bind(this, m.slug)}
                onInfoClick={this.gotoMaecenateDashboard.bind(this, m.slug)}
              />
            )}
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
