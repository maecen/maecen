import React, { PropTypes } from 'react'
import { startsWith } from 'strman'
import s from './MaecenateCard.scss'
import { Card, CardContent } from '../Card'

function MaecenateCard (props, context) {
  const { maecenate: {
    title, logo_url: logoUrl, cover_url: coverUrl, cover_type: coverType, teaser
  }, onClick } = props

  return (
    <Card onClick={onClick} className={s.main}>
      <div className={s.header}>
        <img src={logoUrl} className={s.logo} />
        <h4 className={s.title}>{title}</h4>
      </div>
      <div className={s.cover}>
        {coverUrl && startsWith(coverType, 'video')
          ? <video width='100%' src={coverUrl} controls />
          : <img src={coverUrl} width='100%' />
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
