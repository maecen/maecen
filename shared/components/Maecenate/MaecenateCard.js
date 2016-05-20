import React, { PropTypes } from 'react'
import s from './MaecenateCard.scss'

function MaecenateCard (props, context) {
  const { maecenate: {
    title, logo_url: logoUrl, cover_url: coverUrl, teaser
  }, onClick } = props

  const coverStyle = { backgroundImage: `url(${coverUrl})` }

  return (
    <div onClick={onClick} className={s.main}>
      <div className={s.header}>
        <img src={logoUrl} className={s.logo} />
        <h4 className={s.title}>{title}</h4>
      </div>
      <div style={coverStyle} className={s.cover} />
      <div className={s.teaser}>{teaser}</div>
    </div>
  )
}

export default MaecenateCard

MaecenateCard.propTypes = {
  maecenate: PropTypes.shape({
    title: PropTypes.string,
    logo_url: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
}
