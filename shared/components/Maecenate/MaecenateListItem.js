// Imports
import React, { PropTypes } from 'react'

// Utils
import cropCloudy from '../../lib/cropCloudy'

// Components
import ActionInfo from 'material-ui/svg-icons/action/info-outline'
import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'
import ListItem from '../List/ListItem'

export default function MaecenateListItem ({ maecenate, onClick, onInfoClick }) {
  return (
    <div>
      <ListItem
        leftAvatar={
          <Avatar
            src={maecenate.logo && cropCloudy(maecenate.logo.url, 'logo-tiny')}
          />
        }
        primaryText={maecenate.title}
        onClick={onClick}
        rightIcon={onInfoClick &&
          <ActionInfo style={style.rightIcon} onClick={onInfoClick} />
        }
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
  rightIcon: {
    width: '30px',
    height: '30px',
    margin: '9px'
  }
}