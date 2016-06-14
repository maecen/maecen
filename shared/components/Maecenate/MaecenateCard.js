import React, { PropTypes } from 'react'
import s from './MaecenateCard.scss'
import { Card, CardContent } from '../Card'
import cropCloudy from '../../lib/cropCloudy'
import Media from '../Media/Media'

function MaecenateCard (props, context) {
  const { maecenate: {
    title, logo, cover, teaser
  }, onClick } = props

  if (!logo || !cover) return null

  return (
    <Card onClick={onClick} className={s.main}>
      <div className={s.header}>
        <img src={cropCloudy(logo.url, 'logo')} className={s.logo} />
        <h4 className={s.title}>{title}</h4>
      </div>
      <Media type={cover.type} url={cover.url} fixAspect={true} />
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
