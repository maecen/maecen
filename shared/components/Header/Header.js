import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { translate } from 'react-i18next'

import s from './Header.scss'
import Button from '../Form/Button'
import Icon from '../Graphics/Icon'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import IconButton from 'material-ui/IconButton'
import Burn from 'material-ui/svg-icons/social/whatshot'

function Header (props, context) {
  const {
    hasAuth,
    t,
    loginAction,
    adminMaecenates,
    createPost,
    hideFab,
    getAccessAction,
    hasAccess
  } = props

  return (
    <header className={s.main}>
      <Link to='/'>
        <Icon size='3rem'
          viewBox='0 0 832 687'
          icon='maecen-m-only'
        />
      </Link>
        <div className={s.rightmenu}>
        {hasAccess
          ? hasAuth === false
            ? <Button label={t('login')}
                primary={true}
                last={true}
                onClick={loginAction}
              />
            : <Link to='/profile'>
                <Button
                  primary={true}
                  last={true}
                  label={t('profile')}
                />
              </Link>
          : <IconButton
              onClick={getAccessAction} >
              <Burn color='rgba(255,255,255,0.25)'/>
            </IconButton>
          }
        </div>
      }
      { !hideFab &&
        adminMaecenates.length !== 0 &&
          <div className={s.fabWrap}>
            <FloatingActionButton
              className={s.fab}
              style={{backgroundColor: 'transparent'}}
              onClick={createPost}
            >
              <ContentAdd />
            </FloatingActionButton>
          </div>
        }
    </header>
  )
}

Header.propTypes = {
  hasAuth: PropTypes.bool.isRequired,
  loginAction: PropTypes.func.isRequired,
  adminMaecenates: PropTypes.array.isRequired,
  createPost: PropTypes.func.isRequired,
  getAccessAction: PropTypes.func.isRequired,
  hasAccess: PropTypes.bool.isRequired
}

export default translate(['common'])(
  Header
)
