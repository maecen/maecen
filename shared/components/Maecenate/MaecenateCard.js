import React, { PropTypes } from 'react'
import { startsWith } from 'strman'
import s from './MaecenateCard.scss'
import { Card, CardContent } from '../Card'
import cropCloudy from '../../lib/cropCloudy'

function MaecenateCard (props, context) {
  const { maecenate: {
    title, logo_url: logoUrl, cover_url: coverUrl, cover_type: coverType, teaser
  }, onClick } = props

  const logoCropped = cropCloudy(logoUrl, 'logo')
  var imageCropped = ''
  if (coverType !== 'video') {
    imageCropped = cropCloudy(coverUrl, 'cover')
  }

  return (
    <Card onClick={onClick} className={s.main}>
      <div className={s.header}>
        <img src={logoCropped} className={s.logo} />
        <h4 className={s.title}>{title}</h4>
      </div>
      <div className={s.cover}>
        {coverUrl && startsWith(coverType, 'video')
          ? <video className={s.coverVideo} src={coverUrl} controls />
          : <img src={imageCropped} className={s.coverImage} />
        }
      </div>
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
