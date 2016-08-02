import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import HeaderContainer from '../HeaderContainer'
import FooterContainer from '../FooterContainer'
import AuthDialogContainer from '../AuthDialogContainer'
import s from './App.scss'

export const themeColor = 'hsl(190, 100%, 30%)'
// const themeColor = '#967049'

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

function App (props) {
  const { showAuthModal, navToUrl } = props

  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <div>

        <div className={s.main}>
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
