import React, { PropTypes } from 'react'

// import styleVariables from '../styleVariables'
import { Card, CardContent, CardTitle } from '../Card'
import cropCloudy from '../../lib/cropCloudy'
import Media from '../Media/Media'
import Avatar from 'material-ui/Avatar'

function MaecenateCard (props, context) {
  const { maecenate: {
    title, logo, cover, teaser
  }, onClick } = props

  // const style = {
  //   avatar: {
  //     marginLeft: styleVariables.spacer.base,
  //     marginBottom: '-' + styleVariables.spacer.base,
  //     marginTop: styleVariables.spacer.base
  //   },
  //   card: {
  //     marginBottom: styleVariables.spacer.base
  //   }
  // }

  if (!logo || !cover) return null

  return (
    <Card onClick={onClick}
      // style={style.card}
    >
      <Avatar
        src={cropCloudy(logo.url, 'logo-tiny')}
        size={60}
        // style={style.avatar}
      />
      <CardTitle title={title} />
      <Media type={cover.type} url={cover.url} fixedRatio={true} />
      <CardContent>{teaser}</CardContent>
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
