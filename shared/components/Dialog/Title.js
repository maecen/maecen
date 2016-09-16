// Imports
import React, { PropTypes } from 'react'

export default function Title ({ children, title }) {
  title = title || children
  return <h3 style={style.base}>{title}</h3>
}

Title.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node
}

const style = {
  base: {
    margin: '0px',
    padding: '0',
    color: 'rgba(0, 0, 0, 0.870588)',
    fontSize: '22px',
    lineHeight: '32px',
    fontWeight: '400',
    borderBottom: 'none'
  }
}
