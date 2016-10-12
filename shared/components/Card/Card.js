import React, { PropTypes } from 'react'
import MaterialCard from 'material-ui/Card'
import styleVariables from '../styleVariables'

export default function Card ({
  style,
  onClick,
  children,
  ...props
}) {
  const baseStyle = {...objStyle.base, ...style}

  return (
    <MaterialCard style={baseStyle} {...props}>
      {onClick
        ? <div onClick={onClick}>{children}</div>
        : children
      }
    </MaterialCard>
  )
}

const objStyle = {
  base: {
    marginBottom: styleVariables.spacer.base,
    boxShadow: 'none',
    // relative because absolute positioned edit buttons
    position: 'relative'
  }
}

Card.propTypes = {
  onClick: PropTypes.func
}
