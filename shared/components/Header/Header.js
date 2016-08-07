import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { translate } from 'react-i18next'
import styleVariables from '../styleVariables'

import Button from '../Form/Button'
import Icon from '../Graphics/Icon'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import IconButton from 'material-ui/IconButton'
import Burn from 'material-ui/svg-icons/social/whatshot'
import PersonIcon from 'material-ui/svg-icons/social/person-outline'
import SearchIcon from 'material-ui/svg-icons/action/search'

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

  const style = {
    icon: {
      width: styleVariables.icon.size.lg,
      height: styleVariables.icon.size.lg
    },
    logo: {
      color: styleVariables.color.bodyText
    },
    iconColor: styleVariables.color.icon,
    main: {
      marginBottom: styleVariables.spacer.base,
      padding: '1vw 0'
    },
    rightmenu: {
      float: 'right',
      marginLeft: styleVariables.spacer.base,
      marginTop: styleVariables.spacer.half
    },
    fabWrap: {
      bottom: styleVariables.spacer.base,
      maxWidth: styleVariables.media.lg,
      pointerEvents: 'none',
      position: 'fixed',
      width: `calc(100% - ${styleVariables.spacer.base})`,
      zIndex: '1300'
    },
    fab: {
      backgroundColor: 'transparent',
      float: 'right',
      pointerEvents: 'all'
    }

  }

  return (
    <header style={style.main}>
      <Link to='/' style={style.logo}>
        <Icon size={styleVariables.icon.size.xl}
          viewBox='0 0 832 687'
          icon='maecen-m-only'
        />
      </Link>
      <div style={style.rightmenu}>
        {hasAccess
        ? hasAuth === false
          ? <Button label={t('login')}
              primary={true}
              last={true}
              onClick={loginAction}
            />
          : <span>
              <Link to='/maecenates'>
                <SearchIcon color={style.iconColor} style={style.icon}/>
              </Link>
              <Link to='/profile'>
                <PersonIcon color={style.iconColor} style={style.icon}/>
              </Link>
            </span>
        : <IconButton
            onClick={getAccessAction} >
            <Burn color='rgba(255,255,255,0.25)'/>
          </IconButton>
        }
      </div>
      { !hideFab &&
        adminMaecenates.length !== 0 &&
          <div style={style.fabWrap}>
            <FloatingActionButton
              style={style.fab}
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
