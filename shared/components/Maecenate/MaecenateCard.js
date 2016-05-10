import React, { PropTypes } from 'react'

function MaecenateCard (props, context) {
  const { maecenate: {
    title, logoUrl
  }, onClick } = props

  return (
    <div onClick={onClick} style={{ cursor: 'pointer' }}>
      <h4>{title}</h4>
      <img src={logoUrl} />
    </div>
  )
}

export default MaecenateCard

MaecenateCard.propTypes = {
  maecenate: PropTypes.shape({
    title: PropTypes.string,
    logoUrl: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
}
