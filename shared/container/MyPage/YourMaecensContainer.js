// Imports
import React, { Component } from 'react'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

// Actions & Selectors
import * as Actions from '../../actions'
import { getAuthUserId } from '../../selectors/user'
import { getSupportedMaecenates } from '../../selectors/maecenate'

// Components
import { List } from 'material-ui/List'
import { Card, CardTitle, CardContent } from '../../components/Card'
import Button from '../../components/Form/Button'
import MaecenateListItem from '../../components/Maecenate/MaecenateListItem'
import UserSupportDialog from '../Dialogs/UserSupportDialog'

class YourMaecensContainer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      supportMaecenateId: null
    }

    this.showSupportInfo = this.showSupportInfo.bind(this)
    this.hideSupportInfo = this.hideSupportInfo.bind(this)
  }

  componentDidMount () {
    const { dispatch, userId } = this.props
    dispatch(Actions.fetchSupportedMaecenates(userId))
  }

  gotoMaecenate (slug) {
    browserHistory.push(`/${slug}`)
  }

  showSupportInfo (maecenateId, event) {
    event.stopPropagation() // So the parent elements click method isn't fired
    this.setState({ supportMaecenateId: maecenateId })
  }

  hideSupportInfo () {
    this.setState({ supportMaecenateId: null })
  }

  render () {
    const { t, maecenates } = this.props
    let title = maecenates.length === 0
      ? t('user.noMaecenatesSupported')
      : t('user.maecenatesSupported')

    const { supportMaecenateId } = this.state

    return (
      <Card>
        <CardTitle title={title} />
        {maecenates.length > 0 &&
          <List>
            {maecenates.map((o, i) => (
              <MaecenateListItem
                key={i}
                maecenate={o}
                onClick={this.gotoMaecenate.bind(this, o.slug)}
                onInfoClick={this.showSupportInfo.bind(this, o.id)}
                support={o.support}
                />
            ))}
          </List>
        }
        <CardContent style={{textAlign: 'right'}}>
          <Link to='/maecenates'>
            <Button
              primary={true}
              label={t('maecenate.seeAll')}
              last={true}
            />
          </Link>
        </CardContent>

        <UserSupportDialog
          maecenateId={supportMaecenateId}
          close={this.hideSupportInfo}
        />
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
