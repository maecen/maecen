import React from 'react'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import {Grid} from 'react-flexbox-grid/lib'

import s from './Header.scss'
import Button from '../Form/Button'
import Icon from '../Graphics/Icon'

function Header (props, context) {
  const {hasAuth, t} = props

  return (
    <header className={s.main}>
      <Grid>
        <Link to='/'>
          <Icon size='4rem'
            viewBox='0 0 832 997'
            icon='maecen-detail'
          />
        </Link>
        <div className={s.rightmenu}>
          <Link to='/create-maecenate' className={s.paddingright}>
            <Button label={t('mc.create')} />
          </Link>

          { hasAuth === false
            ? <Link to='/login'><Button label={t('login')} /></Link>
            : <Link to='/profile'><Button label={t('profile')} /></Link>
          }
        </div>
      </Grid>
    </header>
  )
}

export default translate(['common'])(
  Header
)
