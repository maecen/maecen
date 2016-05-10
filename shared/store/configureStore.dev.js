import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { browserHistory } from 'react-router'
import DevTools from '../container/DevTools/DevTools'
import * as reducers from '../reducers/reducer'

export function configureStore (initialState = {}) {
  const enhancerServer = applyMiddleware(thunk)
  let enhancerClient

  if (process.env.CLIENT) {
    enhancerClient = compose(
      applyMiddleware(thunk, routerMiddleware(browserHistory)),
      window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument()
    )
  }

  const reducer = combineReducers({
    ...reducers,
    routing: routerReducer
  })

  let store

  if (process.env.CLIENT) {
    store = createStore(reducer, initialState, enhancerClient)
  } else {
    store = createStore(reducer, initialState, enhancerServer)
  }

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers/reducer', () => {
      const nextReducer = require('../reducers/reducer').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
