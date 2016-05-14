import React from 'react'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import {Grid} from 'react-flexbox-grid/lib'

import s from './Header.scss'

function Header (props, context) {
  const {hasAuth, t} = props

  return (
    <header className={s.main}>
      <Grid>
        <Link to='/'>{t('home')}</Link>

        <Link to='/create-maecenate'>{t('maecenate.create')}</Link>

        { hasAuth === false
          ? <Link to='/login'>{t('login')}</Link>
          : <Link to='/profile'>{t('profile')}</Link>
        }
      </Grid>
    </header>
  )
}

export default translate(['common'])(
  Header
)
