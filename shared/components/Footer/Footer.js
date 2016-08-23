import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'
import styleVariables from '../styleVariables'
import * as Flags from '../Graphics/Flags'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

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
  const { hasAuth, lang, langOptions, changeLang, showLangSwitch, user } = props
  const { spacer, icon } = styleVariables
  const userLang = user ? user.language : ''

  console.log(userLang)

  const style = {
    footer: {
      padding: `${spacer.base} 0px ${spacer.quart}`,
      color: styleVariables.color.bodyText
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
      width: '50px'
    },
    selectUnderline: {
      display: 'none'
    }
  }

  return (
    <footer style={style.footer}>
      { (hasAuth && !showLangSwitch) ||
        <SelectField
          value={lang}
          onChange={changeLang}
          style={style.selectField}
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
    </footer>
  )
}

Footer.propTypes = {
  changeLang: PropTypes.func,
  lang: PropTypes.string,
  langOptions: PropTypes.arrayOf(PropTypes.string)
}

export default translate(['common'])(
  Footer
)
