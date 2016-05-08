import React from 'react'
import routes from '../shared/routes'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { configureStore } from '../shared/store/configureStore'
import mapInitialState from '../shared/lib/mapInitialState'

const initialState = mapInitialState(window.__INITIAL_STATE__)

const store = configureStore(initialState)
const history = browserHistory
const dest = document.getElementById('root')

render(<Provider store={store}>
        <Router history={history} routes={routes} />
       </Provider>, dest)
