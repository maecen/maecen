import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'

import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import * as Flags from '../Graphics/Flags'
import styleVariables from '../styleVariables'

export default translate(['common'])(Switch);

Switch.propTypes = {
  changeLang: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  langOptions: PropTypes.arrayOf(PropTypes.string).isRequired
}

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

function Switch(props) {
  const { lang, langOptions, changeLang } = props

  return (
    <SelectField
      value={lang}
      onChange={changeLang}
      style={style.field}
      iconStyle={style.icon}
      labelStyle={style.label}
      underlineStyle={style.underline}
    >
      {langOptions.map((option) =>
        <MenuItem
          value={option} key={option}
          label={languages[option].flag}
          primaryText={languages[option].name} />
      )}
    </SelectField>
  )
}

const { spacer, icon, defaults, color } = styleVariables
const style = {
  label: {
    width: icon.size.sm,
    height: icon.size.sm,
    top: spacer.base,
    borderRadius: styleVariables.border.radius,
    overflow: 'hidden',
    paddingRight: 0,
    lineHeight: 0
  },
  field: {
    marginRight: spacer.base,
    width: '44px'
  },
  underline: {
    display: 'none'
  },
  icon: {
    fill: color.textColor
  }
}
