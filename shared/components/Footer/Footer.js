import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'
import s from './Footer.scss'

const languageNames = {
  da: 'Dansk',
  en: 'English'
}

function Footer (props, context) {
  const { hasAuth, lang, langOptions, changeLang, showLangSwitch, t } = props

  return (
    <footer className={s.footer}>
      { (hasAuth && !showLangSwitch) ||
        <div>
          <span className={s.langSelectText}>{t('changeLanguage')}</span>
          <select onChange={changeLang} defaultValue={lang}>
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
