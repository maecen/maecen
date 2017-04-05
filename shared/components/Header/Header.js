// Imports
import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'

import styleVariables from '../styleVariables'

// Components
import Link from '../Link'
import Button from '../Form/Button'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import IconButton from 'material-ui/IconButton'
import PersonIcon from 'material-ui/svg-icons/social/person-outline'
import SearchIcon from 'material-ui/svg-icons/action/search'
import SvgIcon from 'material-ui/SvgIcon'

const MaecenIcon = (props) => (
  <SvgIcon {...props}>
    <path d='M0 124c0-3 2-3 5-3 45 0 112 97 139 138 65 99 156 333 223 333 55 0 176-262 212-326C622 190 733 0 821 0c7 0 11 4 11 12 0 33-57 109-89 150 4 98 10 201 22 291 8 60 26 105 26 167 0 28-17 67-44 67-21 0-31-33-37-55-16-63-23-146-23-224 0-57 13-130 14-186-60 88-124 248-196 350-28 40-73 94-125 94-79 0-157-155-215-270-8 86 11 171-34 251-8 17-26 28-45 27-16 0-39-6-39-22 0-44 43-79 65-318 1-11 0-17 4-25C84 220 0 145 0 124z'/> // eslint-disable-line max-len
  </SvgIcon>
)

const BetaIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M50 424H0V298h45c8 0 15 1 21 3 6 1 11 3 15 6s8 6 10 11c2 4 3 9 3 15l-1 8a26 26 0 0 1-8 14l-8 5 9 4a24 24 0 0 1 10 14l1 9c0 12-4 21-12 27s-20 10-35 10zm150-102h-56v26h47v23h-47v29h56v24h-87V298h87v24zm74 102h-30V322h-37v-24h105v24h-38v102zm151 0h-32l-8-24h-41l-7 24h-33l46-126h29l46 126zM51 370H30v30h20l8-1 5-3 3-4 1-6-1-6-3-5-5-4-7-1zm300 7h27l-13-43-14 43zM45 322H30v29h16c6 0 11-2 14-4s4-6 4-10c0-6-1-9-4-12-3-2-8-3-15-3z" /> // eslint-disable-line max-len
  </SvgIcon>
)

function Header (props, context) {
  const {
    hasAuth,
    t,
    loginAction,
    adminMaecenates,
    hideFab,
    allMaecenatesUrl,
    myPageUrl,
    homeUrl,
    createPostUrl
  } = props

  return (
    <header style={style.main}>
      <div style={style.wrapper}>
        <Link to={homeUrl}>
          <IconButton
            style={style.homeBtnStyle}
            iconStyle={style.homeBtnIconStyle}
            touchRippleColor={style.homeIconColor}
          >
            <MaecenIcon color={style.homeIconColor} viewBox='0 0 832 687'/>
          </IconButton>
        </Link>
        <BetaIcon style={style.BetaIcon} viewBox='0 0 426 426'/>
        <div style={style.rightmenu}>
          { hasAuth === false
            ? <Button label={t('login')}
                primary={true}
                last={true}
                onClick={loginAction}
              />
            : <span>
                <Link to={myPageUrl}>
                  <IconButton
                    style={style.btnStyle}
                    iconStyle={style.btnIconStyle}
                    touchRippleColor={style.homeIconColor}
                  >
                    <PersonIcon color={style.iconColor} style={style.icon}/>
                  </IconButton>
                </Link>
              </span>
          }
        </div>
        { !hideFab &&
          adminMaecenates.length !== 0 &&
            <Link to={createPostUrl} style={style.fabWrap}>
              <FloatingActionButton style={style.fab}>
                <ContentAdd />
              </FloatingActionButton>
            </Link>
          }
      </div>
    </header>
  )
}

const { color, spacer, icon, defaults } = styleVariables
const style = {
  BetaIcon: {
    fill: color.primary,
    height: spacer.double,
    width: spacer.double
  },
  main: {
    backgroundColor: color.headerBG,
    marginBottom: spacer.tripple,
    padding: '.5vw 0'
  },
  wrapper: {
    margin: defaults.margin,
    maxWidth: defaults.maxWidth,
    padding: defaults.padding
  },
  icon: {
    width: icon.size.lg,
    height: icon.size.lg
  },
  logo: {
    color: color.bodyText
  },
  iconColor: color.bodyText,
  homeIconColor: color.bodyText,
  rightmenu: {
    float: 'right',
    marginLeft: spacer.base,
    marginTop: spacer.half
  },
  fabWrap: {
    padding: spacer.half,
    maxWidth: styleVariables.media.lg,
    pointerEvents: 'none',
    position: 'fixed',
    bottom: '0',
    boxSizing: 'border-box',
    margin: '0 auto',
    left: '0',
    right: '0',
    width: '100%',
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

Header.propTypes = {
  hasAuth: PropTypes.bool.isRequired,
  loginAction: PropTypes.func.isRequired,
  adminMaecenates: PropTypes.array.isRequired,
  homeUrl: PropTypes.string.isRequired,
  myPageUrl: PropTypes.string.isRequired,
  allMaecenatesUrl: PropTypes.string.isRequired,
  createPostUrl: PropTypes.string.isRequired
}

export default translate(['common'])(
  Header
)
