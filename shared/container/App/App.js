import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import AuthDialogContainer from '../AuthDialogContainer'
import './App.scss'

const muiTheme = getMuiTheme({
  userAgent: 'all',
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#C69C76',
    primary2Color: '#C69C76',
    primary3Color: '#C69C76'
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
