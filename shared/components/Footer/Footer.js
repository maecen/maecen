// Imports
import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'

import styleVariables from '../styleVariables'

// Components
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import * as Flags from '../Graphics/Flags'
import { TextLink } from '../../components/Link'

const languages = {
  da: {
    name: 'Dansk',
    flag: <Flags.DanishFlag />
  },
  en: {
    name: 'English',
    flag: <Flags.EnglishFlag />
  }
}

function Footer (props) {
  const { hasAuth, lang, langOptions, changeLang, showLangSwitch, t } = props

  return (
    <footer style={style.footer}>
      <div style={style.footerContent}>
        { (hasAuth && !showLangSwitch) ||
          <SelectField
            value={lang}
            onChange={changeLang}
            style={style.selectField}
            iconStyle={style.selectIcon}
            labelStyle={style.selectLabel}
            underlineStyle={style.selectUnderline}
          >
            {langOptions.map((option) =>
              <MenuItem
                value={option} key={option}
                label={languages[option].flag}
                primaryText={languages[option].name} />
            )}
          </SelectField>
        }

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
  selectLabel: {
    width: icon.size.sm,
    height: icon.size.sm,
    top: spacer.base,
    borderRadius: styleVariables.border.radius,
    overflow: 'hidden',
    paddingRight: 0,
    lineHeight: 0
  },
  selectField: {
    marginRight: spacer.base,
    width: '44px'
  },
  selectUnderline: {
    display: 'none'
  },
  selectIcon: {
    fill: color.textColor
  },
  footerLink: {
    color: styleVariables.color.bodyText,
    cursor: 'pointer',
    paddingRight: spacer.base,
    paddingTop: spacer.half,
    paddingBottom: spacer.quart
  }
}

Footer.propTypes = {
  changeLang: PropTypes.func,
  lang: PropTypes.string,
  langOptions: PropTypes.arrayOf(PropTypes.string)
}

export default translate(['common'])(
  Footer
)
