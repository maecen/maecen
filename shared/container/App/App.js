// Imports
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import styleVariables from '../../components/styleVariables'

// Components
import HeaderContainer from '../HeaderContainer'
import FooterContainer from '../FooterContainer'
import AuthDialogContainer from '../AuthDialogContainer'

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

function App (props) {
  const { showAuthModal, navToUrl } = props

  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      <div>

        <div style={style.main}>
          <HeaderContainer>
            { props.children }
          </HeaderContainer>
          <div style={style.contentWrap}>
            { props.children }
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

const style = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: '0 .5rem',
    maxWidth: '70rem',
    margin: '0 auto'
  },
  contentWrap: {
    display: 'flex',
    flex: '1',
    justifyContent: 'center',
    paddingBottom: styleVariables.spacer.quadrouple
  }
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
