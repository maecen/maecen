import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'
import styleVariables from '../styleVariables'

import Button from '../Form/Button'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import IconButton from 'material-ui/IconButton'
import Burn from 'material-ui/svg-icons/social/whatshot'
import PersonIcon from 'material-ui/svg-icons/social/person-outline'
import SearchIcon from 'material-ui/svg-icons/action/search'
import SvgIcon from 'material-ui/SvgIcon'

const MaecenIcon = (props) => (
  <SvgIcon {...props}>
    <path d='M0 124c0-3 2-3 5-3 45 0 112 97 139 138 65 99 156 333 223 333 55 0 176-262 212-326C622 190 733 0 821 0c7 0 11 4 11 12 0 33-57 109-89 150 4 98 10 201 22 291 8 60 26 105 26 167 0 28-17 67-44 67-21 0-31-33-37-55-16-63-23-146-23-224 0-57 13-130 14-186-60 88-124 248-196 350-28 40-73 94-125 94-79 0-157-155-215-270-8 86 11 171-34 251-8 17-26 28-45 27-16 0-39-6-39-22 0-44 43-79 65-318 1-11 0-17 4-25C84 220 0 145 0 124z'/> // eslint-disable max-len
  </SvgIcon>
)

const style = {
  icon: {
    width: styleVariables.icon.size.lg,
    height: styleVariables.icon.size.lg
  },
  logo: {
    color: styleVariables.color.bodyText
  },
  iconColor: styleVariables.color.icon,
  homeIconColor: styleVariables.color.bodyText,
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
  },
  btnIconStyle: {
    width: '40px',
    height: '40px',
    padding: '0px'
  },
  btnStyle: {
    width: '48px',
    height: '48px',
    margin: '-4px',
    padding: '0px'
  },
  homeBtnIconStyle: {
    width: '50px',
    height: '50px'
  },
  homeBtnStyle: {
    width: '74px',
    height: '74px',
    margin: '-12px'
  }
}

function Header (props, context) {
  const {
    hasAuth,
    t,
    loginAction,
    adminMaecenates,
    createPost,
    hideFab,
    getAccessAction,
    hasAccess,
    gotoAllMaecenates,
    gotoMyPage,
    gotoHome
  } = props

  return (
    <header style={style.main}>
      <IconButton
        style={style.homeBtnStyle}
        iconStyle={style.homeBtnIconStyle}
        onTouchTap={gotoHome}
        touchRippleColor={style.homeIconColor}>
        <MaecenIcon
          color={style.homeIconColor}
          viewBox='0 0 832 687' />
      </IconButton>
      <div style={style.rightmenu}>
        {hasAccess
        ? hasAuth === false
          ? <Button label={t('login')}
              primary={true}
              last={true}
              onClick={loginAction}
            />
          : <span>
              <IconButton
                style={style.btnStyle}
                iconStyle={style.btnIconStyle}
                onTouchTap={gotoAllMaecenates}
                touchRippleColor={style.homeIconColor}>
                <SearchIcon color={style.iconColor}/>
              </IconButton>
              <IconButton
                style={style.btnStyle}
                iconStyle={style.btnIconStyle}
                onTouchTap={gotoMyPage}
                touchRippleColor={style.homeIconColor}>
                <PersonIcon color={style.iconColor} style={style.icon}/>
              </IconButton>
            </span>
        : <IconButton
            onTouchTap={getAccessAction} >
            <Burn color='rgba(255,255,255,0.25)'/>
          </IconButton>
        }
      </div>
      { !hideFab &&
        adminMaecenates.length !== 0 &&
          <div style={style.fabWrap}>
            <FloatingActionButton
              style={style.fab}
              onTouchTap={createPost}>
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
  gotoHome: PropTypes.func.isRequired,
  gotoMyPage: PropTypes.func.isRequired,
  gotoAllMaecenates: PropTypes.func.isRequired,
  getAccessAction: PropTypes.func.isRequired,
  hasAccess: PropTypes.bool.isRequired
}

export default translate(['common'])(
  Header
)
