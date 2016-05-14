import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'
import {Grid} from 'react-flexbox-grid/lib'

const languageNames = {
  da: 'Dansk',
  en: 'English'
}

function Footer (props, context) {
  const { lang, langOptions, changeLang } = props

  return (
    <footer>
      <Grid>
        Change language
        <select onChange={changeLang} defaultValue={lang}>
          {langOptions.map((option) =>
            <option value={option} key={option}>{languageNames[option]}</option>
          )}
        </select>
      </Grid>
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

