// Imports
import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'

import styleVariables from '../styleVariables'

// Components
import { TextLink } from '../../components/Link'


function Footer (props) {
  const { t } = props

  return (
    <footer style={style.footer}>
      <div style={style.footerContent}>
        <TextLink to='/terms' style={style.footerLink}>
          {t('terms')}
        </TextLink>
        <TextLink to='/about' style={style.footerLink}>
          {t('aboutMaecen')}
        </TextLink>
      </div>
    </footer>
  )
}

const { spacer, icon, defaults, color } = styleVariables
const style = {
  footer: {
    padding: `${spacer.base} 0px 0px`,
    color: styleVariables.color.bodyText
  },
  footerContent: {
    alignItems: 'center',
    display: 'flex',
    margin: defaults.margin,
    maxWidth: defaults.maxWidth,
    minHeight: spacer.tripple,
    padding: defaults.padding
  },
  footerLink: {
    color: styleVariables.color.bodyText,
    cursor: 'pointer',
    paddingRight: spacer.base,
    paddingTop: spacer.half,
    paddingBottom: spacer.quart
  }
}


export default translate(['common'])(
  Footer
)
