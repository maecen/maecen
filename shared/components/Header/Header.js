// Imports
import React, { PropTypes } from 'react'
import { translate } from 'react-i18next'

import styleVariables from '../styleVariables'

// Components
import Link from '../Link'
import Button from '../Form/Button'
import LanguageSwitch from '../../components/Language/Switch';
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import IconButton from 'material-ui/IconButton'
import PersonIcon from 'material-ui/svg-icons/social/person-outline'
import SearchIcon from 'material-ui/svg-icons/action/search'
import SvgIcon from 'material-ui/SvgIcon'

const MaecenIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M430 473.33h19.03V0h-21.58L267.78 328.15 107.86.37H86.97L256.64 349.5h20.9L430.07 39.25 430 473.33zM39.77 474.82h18.89l.21-328.96-19.1-38.6v367.56z"/>
    <path d="M411.95 474.82h-18.89l-.2-328.96 19.09-38.6v367.56zM372.89 473.33h-18.81V221.81l18.81-38.07v289.59zM77.56 473.33h18.81V221.81l-18.81-38.07v289.59zM334.88 473.33h-19.37V302.31l19.37-39.62v210.64zM115.1 473.33h19.37V302.31l-19.37-39.62v210.64zM405.99 0h-21.26L253.06 269.29l10.88 21.75L405.99 0zM362.67 0h-21.33L231.03 224.52l11.04 21.54L362.67 0zM235.21 350H214.1L44.58 0h21.18l169.45 350z"/>
    <path d="M192.84 350h-21.86L19.31 41.72v431.61H0V0h22.44l170.4 350z"/>
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
    createPostUrl,
    currLang,
    langOptions,
    changeLang,
    showLangSwitch
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
            <MaecenIcon color={style.homeIconColor} viewBox='0 0 449.03 474.82'/>
          </IconButton>
        </Link>
        <div style={style.rightmenu}>
          { (hasAuth && !showLangSwitch) ||
            <LanguageSwitch
              lang={currLang}
              langOptions={langOptions}
              changeLang={changeLang}  />
          }
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
    marginTop: spacer.half,
    display: 'flex',
    alignItems: 'center'
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
