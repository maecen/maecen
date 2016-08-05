import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'
import styleVariables from '../styleVariables'

const languageNames = {
  da: 'Dansk',
  en: 'English'
}

function Footer (props, context) {
  const { hasAuth, lang, langOptions, changeLang, showLangSwitch, t } = props

  const style = {
    footer: {
      padding: `${styleVariables.spacer.base} 0`,
      color: styleVariables.color.bodyText
    },
    select: {
      marginLeft: styleVariables.spacer.base
    }
  }

  return (
    <footer style={style.footer}>
      { (hasAuth && !showLangSwitch) ||
        <div>
          <span>{t('changeLanguage')}</span>
          <select
            onChange={changeLang}
            defaultValue={lang}
            style={style.select}
          >
            {langOptions.map((option) =>
              <option value={option} key={option}>{languageNames[option]}</option>
            )}
          </select>
        </div>
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
