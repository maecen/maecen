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
  const { hasAuth, lang, langOptions, changeLang, showLangSwitch } = props
  const { spacer, icon } = styleVariables
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
      paddingRight: '0px',
      lineHeight: '0px'
    }
  }

  return (
    <footer style={style.footer}>
      { (hasAuth && !showLangSwitch) ||
        <SelectField
          value={lang}
          onChange={changeLang}
          style={{width: '50px'}}
          labelStyle={style.selectLabel}
          underlineStyle={{display: 'none'}}
          // iconStyle={{display: 'none'}}
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
