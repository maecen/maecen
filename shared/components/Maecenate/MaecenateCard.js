import React, { PropTypes } from 'react'

import styleVariables from '../styleVariables'
import { Card, CardContent, CardTitle } from '../Card'
import cropCloudy from '../../lib/cropCloudy'
import Media from '../Media/Media'
import Avatar from 'material-ui/Avatar'

function MaecenateCard (props, context) {
  const { maecenate: {
    title, logo, cover, teaser
  }, onClick } = props

  const descriptionLineCount = 3
  const descriptionHeight =
    styleVariables.font.lineHeight.body * descriptionLineCount - 0.2 + 'em'
  const style = {
    avatar: {
      margin: styleVariables.spacer.base,
      marginRight: '0px'
    },
    card: {
      marginBottom: styleVariables.spacer.base,
      paddingBottom: styleVariables.spacer.base,
      cursor: 'pointer'
    },
    description: {
      height: descriptionHeight,
      display: 'block',
      overflow: 'hidden',
      padding: '0px',
      margin: styleVariables.spacer.base,
      marginBottom: '0px'
    },
    header: {
      display: 'flex',
      alignItems: 'center'
    },
    headerSubtitle: {
      display: 'none'
    }
  }

  if (!logo || !cover) return null

  return (
    <Card onClick={onClick} style={style.card}>
      <div style={style.header}>
        <Avatar
          src={cropCloudy(logo.url, 'logo-tiny')}
          size={60}
          style={style.avatar}
        />
        <CardTitle title={title} subtitleStyle={style.headerSubtitle} />
      </div>
      <Media type={cover.type} url={cover.url} fixedRatio={true} />
      <CardContent style={style.description}>
        {teaser}
      </CardContent>
    </Card>
  )
}

MaecenateCard.propTypes = {
  maecenate: PropTypes.shape({
    title: PropTypes.string,
    logo: PropTypes.object,
    cover: PropTypes.object
  }).isRequired,
  onClick: PropTypes.func.isRequired
}

export default MaecenateCard
