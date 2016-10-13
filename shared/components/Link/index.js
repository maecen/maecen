import React, { PropTypes } from 'react'
import styleVariables from '../../components/styleVariables'
import { Link as RouterLink } from 'react-router'

export { RouterLink as default }

export const TextLink = ({
  style,
  to,
  children,
  ...props
}) => {
  const newStyle = {...elStyle.base, ...style}

  if (to.startsWith('http://') || to.startsWith('https://')) {
    return (
      <a href={to} style={newStyle} rel='noreferrer' {...props}>{children}</a>
    )
  } else {
    return (
      <RouterLink style={newStyle} to={to} {...props}>{children}</RouterLink>
    )
  }
}

TextLink.propTypes = {
  to: PropTypes.string.isRequired
}

const elStyle = {
  base: {
    textDecoration: 'none',
    color: styleVariables.color.primary
  }
}
