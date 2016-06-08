import React, { PropTypes } from 'react'
import s from './MaecenateCard.scss'
import { Card, CardContent } from '../Card'
import cropCloudy from '../../lib/cropCloudy'
import Media from '../Media/Media'

function MaecenateCard (props, context) {
  const { maecenate: {
    title, logo_url: logoUrl, cover_url: coverUrl, cover_type: coverType, teaser
  }, onClick } = props

  return (
    <Card onClick={onClick} className={s.main}>
      <div className={s.header}>
        <img src={cropCloudy(logoUrl, 'logo')} className={s.logo} />
        <h4 className={s.title}>{title}</h4>
      </div>
      <Media type={coverType} url={coverUrl} fixAspect={true} />
      <CardContent>{teaser}</CardContent>
    </Card>
  )
}

MaecenateCard.propTypes = {
  maecenate: PropTypes.shape({
    title: PropTypes.string,
    logo_url: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
}

export default MaecenateCard
