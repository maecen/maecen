import React, { PropTypes } from 'react'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import './App.scss'

const muiTheme = getMuiTheme({ })

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
