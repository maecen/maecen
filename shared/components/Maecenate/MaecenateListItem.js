// Imports
import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'

// Utils
import cropCloudy from '../../lib/cropCloudy'

// Components
import ActionInfo from 'material-ui/svg-icons/action/info-outline'
import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'
import ListItem from '../List/ListItem'

function MaecenateListItem ({ t, maecenate, onClick, onInfoClick }) {
  return (
    <div>
      <ListItem
        leftAvatar={
          <Avatar
            src={maecenate.logo && cropCloudy(maecenate.logo.url, 'logo-tiny')}
          />
        }
        primaryText={maecenate.title}
        secondaryText={!maecenate.active &&
          t('maecenate.closedSupporterMessage')
        }
        onClick={onClick}
        rightIcon={onInfoClick &&
          <ActionInfo style={style.rightIcon} onClick={onInfoClick} />
        }
        innerDivStyle={style.listItem}
      />
      <Divider />
    </div>
  )
}

MaecenateListItem.propTypes = {
  maecenate: PropTypes.shape({
    logo: PropTypes.shape({
      url: PropTypes.string.isRequired
    }),
    title: PropTypes.string.isRequired
  }),
  onInfoClick: PropTypes.func,
  onClick: PropTypes.func
}

const style = {
  listItem: {
    wordWrap: 'break-word'
  },
  rightIcon: {
    width: '30px',
    height: '30px',
    margin: '9px'
  }
}

export default translate(['common'])(
  MaecenateListItem
)
