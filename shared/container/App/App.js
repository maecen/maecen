import React, { PropTypes } from 'react'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
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
  return (
    <MuiThemeProvider muiTheme={muiTheme}>
      { props.children }
    </MuiThemeProvider>
  )
}

App.propTypes = {
  children: PropTypes.object.isRequired
}

export default App
