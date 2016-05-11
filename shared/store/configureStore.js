import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware, routerReducer } from 'react-router-redux'
import { browserHistory } from 'react-router'
import DevTools from '../container/DevTools/DevTools'
import * as reducers from '../reducers/reducer'

export function configureStore (initialState = {}) {
  const reducer = combineReducers({
    ...reducers,
    routing: routerReducer
  })

  let store

  // Client for development
  if (process.env.CLIENT && process.env.NODE_ENV !== 'production') {
    const enhancer = compose(
      applyMiddleware(thunk, routerMiddleware(browserHistory)),
      window.devToolsExtension
        ? window.devToolsExtension()
        : DevTools.instrument()
    )
    store = createStore(reducer, initialState, enhancer)
  } else {
    const enhancer = applyMiddleware(thunk)
    store = createStore(reducer, initialState, enhancer)
  }

  // Hot module reload for development
  if (module.hot && process.env.NODE_ENV === 'development') {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers/reducer', () => {
      const nextReducer = require('../reducers/reducer').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
