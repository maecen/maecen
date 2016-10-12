import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'
import styleVariables from '../styleVariables'
import * as Flags from '../Graphics/Flags'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import { browserHistory } from 'react-router'

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

function gotoTerms () {
  browserHistory.push('/terms')
}

function gotoAbout () {
  browserHistory.push('/about')
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
        <div
          style={style.footerLink}
          onClick={gotoTerms}>{t('terms')}</div>
        <div
          style={style.footerLink}
          onClick={gotoAbout}>{t('aboutMaecen')}</div>
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
