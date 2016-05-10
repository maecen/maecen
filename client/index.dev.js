import React from 'react'
import routes from '../shared/routes'
import DevTools from '../shared/container/DevTools/DevTools'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { Router, browserHistory } from 'react-router'
import { configureStore } from '../shared/store/configureStore'
import mapInitialState from '../shared/lib/mapInitialState'

import { I18nextProvider } from 'react-i18next'
import i18n from './i18n-client'

i18n.changeLanguage(window.__i18n.locale)
i18n.addResourceBundle(window.__i18n.locale, 'common',
  window.__i18n.resources, true)

const initialState = mapInitialState(window.__INITIAL_STATE__)

const store = configureStore(initialState)
const history = syncHistoryWithStore(browserHistory, store)
const dest = document.getElementById('root')

let toRender

if (process.env.CLIENT && !window.devToolsExtension) {
  toRender = (<Provider store={store}>
                <div>
                  <Router history={history} routes={routes} />
                  <DevTools />
                </div>
              </Provider>)
} else {
  toRender = (<Provider store={store}>
                <Router history={history} routes={routes} />
              </Provider>)
}

render(
  <I18nextProvider i18n={i18n}>
    {toRender}
  </I18nextProvider>
, dest)
