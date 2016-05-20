import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AuthDialogContainer from '../AuthDialogContainer'
import './App.scss'

const themeColor = '#967049'

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
        { props.children }
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
