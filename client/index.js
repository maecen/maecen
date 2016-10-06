// Imports
import React from 'react'
import getRoutes from '../shared/routes'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { Router, browserHistory } from 'react-router'
import { StyleRoot } from 'radium'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { I18nextProvider } from 'react-i18next'
import moment from 'moment'

import configureStore from '../shared/configureStore'
import mapInitialState from '../shared/lib/mapInitialState'
import i18n from './i18n-client'

// Needed for onTouchTap
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

i18n.changeLanguage(window.__i18n.locale)
i18n.addResourceBundle(window.__i18n.locale, 'common',
  window.__i18n.resources, true)

const initialState = mapInitialState(window.__INITIAL_STATE__)

const store = configureStore(initialState)
const history = syncHistoryWithStore(browserHistory, store)
const routes = getRoutes(store)

// Set the correct locale for moment
moment.locale(window.__i18n.locale)

const App = () => (
  <I18nextProvider i18n={i18n}>
    <Provider store={store}>
      <StyleRoot>
        <Router history={history} routes={routes} />
      </StyleRoot>
    </Provider>
  </I18nextProvider>
)

render(
  <App />,
  document.getElementById('root')
)
