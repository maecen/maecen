import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { StyleRoot } from 'radium'
import styleVariables from '../../components/styleVariables'

import HeaderContainer from '../HeaderContainer'
import FooterContainer from '../FooterContainer'
import AuthDialogContainer from '../AuthDialogContainer'
import s from './App.scss'

const themeColor = styleVariables.color.primary
const muiTheme = getMuiTheme({
  userAgent: 'all',
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: themeColor,
    primary2Color: themeColor,
    primary3Color: themeColor,
    accent1Color: themeColor,
    accent2Color: themeColor,
    accent3Color: themeColor
  }
})

const style = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '0 .5rem',
    maxWidth: '70rem',
    margin: '0 auto'
  }
}

function App (props) {
  const { showAuthModal, navToUrl } = props

  return (
    <StyleRoot>
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>

          <div style={style.main}>
            <HeaderContainer>
              { props.children }
            </HeaderContainer>
            <div className={s.contentWrap}>
              <div className={s.content}>
                { props.children }
              </div>
            </div>
            <FooterContainer>
              { props.children }
            </FooterContainer>
          </div>

          <AuthDialogContainer
            open={showAuthModal}
            navToUrl={navToUrl}
          />

        </div>
      </MuiThemeProvider>
    </StyleRoot>
  )
}

App.propTypes = {
  children: PropTypes.object.isRequired
}

function mapStateToProps (store) {
  const { app: { requireAuthorization } } = store

  return {
    showAuthModal: !!requireAuthorization,
    navToUrl: typeof requireAuthorization === 'string' ? requireAuthorization : null
  }
}

export default connect(mapStateToProps)(App)
